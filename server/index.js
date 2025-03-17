import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import Stripe from "stripe";
import { UserRouter } from "./routes/pouzivatel.js";
import { jobRouter } from "./routes/praca.js";
import { createPaymentRouter } from "./routes/platby.js";
import { CitiesRouter } from "./routes/mesta.js";
import { sendEmail } from "./mailer.js";
import { contactRouter } from "./routes/contact.js";
import fetch from "node-fetch"; // Add fetch for proxying
import commentsRouter from "./routes/komenty.js";

// Load environment variables
dotenv.config();
const PORT = process.env.DEV_PORT;
const MONGODB_URI = process.env.DEV_MONGODB_URI;

// Determine the environment
//const isProduction = process.env.NODE_ENV === 'production';

// Select the appropriate variables
//const PORT = isProduction ? process.env.PROD_PORT : process.env.DEV_PORT;
//const MONGODB_URI = isProduction ? process.env.PROD_MONGODB_URI : process.env.DEV_MONGODB_URI;

const app = express();

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_BASE_URL,
      "https://lj5p5fw1-5173.euw.devtunnels.ms",
      "https://www.spravtozamna.eu", // produkcia www
      "https://spravtozamna.eu",  
    ], // Add production URL when you deploy the frontend
    credentials: true,
  })
);

const __dirname = path.resolve();
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(uploadsDir));

const jobPicturesDir = path.join(__dirname, "job_pictures");
if (!fs.existsSync(jobPicturesDir)) {
  fs.mkdirSync(jobPicturesDir);
}

app.use("/job_pictures", express.static(jobPicturesDir));
app.use("/auth", UserRouter);
app.use("/users", UserRouter);

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in the environment variables"
  );
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

app.use("/jobs", jobRouter(stripe));
app.use("/payments", createPaymentRouter(stripe));
app.use(
  "/mesta",
  CitiesRouter({
    GEONAMES_USERNAME: process.env.GEONAMES_USERNAME,
    GEONAMES_API_URL: process.env.GEONAMES_API_URL,
  })
);
app.use("/api", contactRouter);

// Add a route to proxy Google Maps API requests
app.use("/google-maps-api", async (req, res) => {
  const url = `https://maps.googleapis.com${req.url}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.use("/api", commentsRouter); // Add the comments router under '/api'

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
