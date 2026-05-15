// Import required modules
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json("User already exists");
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password (schema field is `name`, not `username`)
    const newUser = new User({
      name: username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    res.status(201).json("User created successfully");

  } catch (err) {
    res.status(500).json(err);
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json("User not found");
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json("Invalid credentials");
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send response with token
    res.status(200).json({
      message: "Login successful",
      token: token,
    });

  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;