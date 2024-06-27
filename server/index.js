import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { UserRouter } from './routes/pouzivatel.js';
import { JobRouter } from './routes/praca.js';
import authMiddleware from './middleware/auth.js';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();


mongoose.connect('mongodb://127.0.0.1:27017/startup')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

const __dirname = path.resolve();
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));
app.use('/auth', UserRouter);
app.use('/api/jobs', JobRouter);
app.use('/api/user', UserRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});