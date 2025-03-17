import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import {
  sendEmail,
  welcomeEmailTemplate,
  resetPasswordEmailTemplate,
} from "../mailer.js";
import authMiddleware from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Job } from "../models/Job.js";
// Define the validateEmail function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Define the validatePassword function
function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
}
const __dirname = path.resolve();
const uploadsDir = path.join(__dirname, "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimeType && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg and .png files are allowed!"));
    }
  },
  limits: { fileSize: 1024 * 1024 * 2 }, // 2MB
});

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!validateEmail(email)) {
    return res.json({ status: false, message: "Neplatný formát emailu" });
  }

  if (!validatePassword(password)) {
    return res.json({
      status: false,
      message:
        "Heslo musí obsahovať minimálne 8 znakov, veľké písmeno, malé písmeno a číslo",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ status: false, message: "Používateľ už existuje" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashpassword,
      phone: "",
      city: "",
      psc: "",
      iban: "",
    });

    await newUser.save();

    const emailOptions = welcomeEmailTemplate(firstName, email);
    await sendEmail(emailOptions);

    return res.json({
      status: true,
      message: "Používateľ úspešne zaregistrovaný",
    });
  } catch (error) {
    console.error("Error during registration:", error.message, error.stack);
    return res.json({
      status: false,
      message: "Registrácia zlyhala",
      error: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: false, message: "Používateľ neexistuje" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.json({ status: false, message: "Nesprávne heslo" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // Ensure the path matches the clearCookie method
      maxAge: 5 * 60 * 60 * 1000, // 5 hours
    });
    return res.json({ status: true, token, message: "Prihlásenie úspešné" });
  } catch (error) {
    console.error(error);
    return res.json({ status: false, message: "Prihlásenie zlyhalo" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/", // Match the path where the cookie was set
  });
  return res.json({ status: true, message: "Logout successful" });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Používateľ nie je registrovaný" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });

    const emailOptions = resetPasswordEmailTemplate(user.firstName, token);
    emailOptions.to = email;

    await sendEmail(emailOptions);

    return res.json({ status: true, message: "Email odoslaný" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Interná chyba servera" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password)
  ) {
    return res.json({
      status: false,
      message:
        "Heslo musí obsahovať minimálne 8 znakov, jedno veľké písmeno a číslo",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const id = decoded.id;
    const hashpassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate({ _id: id }, { password: hashpassword });
    return res.json({ status: true, message: "Heslo bolo úspešne zmenené" });
  } catch (err) {
    console.error(err);
    return res.json({ status: false, message: "Neplatný token" });
  }
});

// Route to get user data
// Route to get user data and job statistics
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const jobs = await Job.find({ confirmedUsers: req.user.id });

    const totalJobs = jobs.length;
    const completedJobs = jobs.filter((job) => job.completed).length;
    const canceledJobs = jobs.filter((job) => job.canceled).length;
    const disputeJobs = jobs.filter((job) => job.dispute).length;
    const averageRating =
      user.ratings.reduce((acc, rating) => acc + rating.rating, 0) /
        user.ratings.length || 0;

    const statistics = {
      totalJobs,
      completedJobs,
      canceledJobs,
      disputeJobs,
      averageRating,
    };

    res.json({ user, statistics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//fetchovanie usera pri userdetails - potvrdenie
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "ratings.jobId",
      "title description"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate average rating
    const totalRatings = user.ratings.length;
    const avgRating =
      totalRatings > 0
        ? (
            user.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            totalRatings
          ).toFixed(1)
        : 0;

    // Calculate total jobs
    const totalJobs = await Job.countDocuments({
      confirmedUsers: req.params.id,
    });

    const userData = {
      ...user.toObject(), // Converts mongoose document to plain object
      avatar: user.avatar, // Ensure the avatar is included explicitly
    };

    return res.json({ user, avgRating: parseFloat(avgRating), totalJobs });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching user details", error: error.message });
  }
});

router.put(
  "/me",
  authMiddleware,
  upload.single("avatar"),
  async (req, res, next) => {
    const { phone, address, city, psc, iban } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const updateData = {};
      if (phone) updateData.phone = phone;
      if (address) updateData.address = address;
      if (city) updateData.city = city;
      if (psc) updateData.psc = psc;
      if (iban) updateData.iban = iban;
      if (avatar) updateData.avatar = avatar;

      const user = await User.findByIdAndUpdate(req.user.id, updateData, {
        new: true,
      }).select("-password");
      if (!user) {
        return res.status(404).json({ message: "Používateľ nenájdený" });
      }
      res.json({ user, message: "Profil bol úspešne aktualizovaný" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export { router as UserRouter };
