// Import required modules
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


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

    // Create new user with hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    // Send success response
    res.status(201).json("User created successfully");

  } catch (err) {

    // Handle server errors
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

    // Create access token
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Change to true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response with access token
    res.status(200).json({
      message: "Login successful",
      accessToken,
    });

  } catch (err) {

    // Handle server errors
    res.status(500).json(err);
  }
});


// ================= REFRESH TOKEN =================
router.post("/refresh", (req, res) => {

  // Get refresh token from cookies
  const refreshToken = req.cookies.refreshToken;

  // Check if refresh token exists
  if (!refreshToken) {
    return res.status(401).json("Refresh token not found");
  }

  // Verify refresh token
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {

    // Check if token is invalid
    if (err) {
      return res.status(403).json("Invalid refresh token");
    }

    // Create new access token
    const newAccessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Send new access token
    res.status(200).json({
      accessToken: newAccessToken,
    });

  });

});


// ================= LOGOUT =================
router.post("/logout", (req, res) => {

  // Clear refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: false, // Change to true in production
  });

  // Send logout response
  res.status(200).json({
    message: "Logged out successfully",
  });

});


// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {

  try {

    // Get email from request body
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json("User not found");
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token to database
    user.resetPasswordToken = resetToken;

    // Set token expiration time (15 minutes)
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    // Save updated user
    await user.save();

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Create reset URL
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Email message
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      text: `Reset your password using this link: ${resetUrl}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send success response
    res.status(200).json({
      message: "Password reset email sent",
    });

  } catch (err) {

    // Handle server errors
    res.status(500).json(err);
  }

});


// ================= RESET PASSWORD =================
router.post("/reset-password/:token", async (req, res) => {

  try {

    // Get token from URL params
    const resetToken = req.params.token;

    // Get new password from request body
    const { password } = req.body;

    // Find user with matching token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    // Check if token is valid
    if (!user) {
      return res.status(400).json("Invalid or expired token");
    }

    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password
    user.password = hashedPassword;

    // Remove reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Save updated user
    await user.save();

    // Send success response
    res.status(200).json({
      message: "Password reset successful",
    });

  } catch (err) {

    // Handle server errors
    res.status(500).json(err);
  }

});


// Export router
module.exports = router;