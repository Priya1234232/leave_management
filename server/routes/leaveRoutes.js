const express = require("express");
const router = express.Router();
const User = require("../models/User");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register user
router.post("/register", async (req, res) => {
  try {
    const username = String(req.body.username || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const rollNumber = String(req.body.rollNumber || "").trim();
    const casualLeave = Number(req.body.casualLeave ?? 10);
    const medicalLeave = Number(req.body.medicalLeave ?? 10);

    if (!username || !email || !rollNumber) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (!Number.isFinite(casualLeave) || casualLeave < 0 ||
        !Number.isFinite(medicalLeave) || medicalLeave < 0) {
      return res.status(400).json({ message: "Leave balances must be zero or greater." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email." });
    }

    const user = await User.create({
      username,
      email,
      rollNumber,
      casualLeave,
      medicalLeave
    });

    return res.status(201).json({
      message: "User created successfully.",
      userId: user._id,
      username: user.username,
      rollNumber: user.rollNumber,
      casualLeave: user.casualLeave,
      medicalLeave: user.medicalLeave
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(error.code === 11000 ? 409 : 500).json({
      message: error.code === 11000 ? "Email is already registered." : "Server error."
    });
  }
});

// Login user (email-only demo login)
router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    return res.json({
      message: "Login successful.",
      userId: user._id,
      username: user.username,
      rollNumber: user.rollNumber,
      casualLeave: user.casualLeave,
      medicalLeave: user.medicalLeave
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

// Get leave balance
router.get("/leave-balance/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    return res.json({
      casualLeave: user.casualLeave,
      medicalLeave: user.medicalLeave
    });
  } catch (error) {
    return res.status(400).json({ message: "Invalid user ID." });
  }
});

// Apply for leave
router.post("/apply-leave/:id", async (req, res) => {
  try {
    const type = req.body.type;
    const days = Number(req.body.days);

    if (!Number.isInteger(days) || days <= 0) {
      return res.status(400).json({ message: "Enter a valid number of leave days." });
    }
    if (!["casual", "medical"].includes(type)) {
      return res.status(400).json({ message: "Invalid leave type." });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const field = type === "casual" ? "casualLeave" : "medicalLeave";
    if (user[field] < days) {
      return res.status(400).json({ message: `Insufficient ${type} leave balance.` });
    }

    user[field] -= days;
    await user.save();

    return res.json({
      message: "Leave application submitted successfully.",
      casualLeave: user.casualLeave,
      medicalLeave: user.medicalLeave
    });
  } catch (error) {
    console.error("Leave application error:", error);
    return res.status(400).json({ message: "Unable to process leave application." });
  }
});

module.exports = router;
