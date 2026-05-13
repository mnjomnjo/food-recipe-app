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

    // Get user data from request body
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Validate email format
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Validate password strength
    // Password must contain:
    // - at least 6 characters
    // - one uppercase letter
    // - one number
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 6 characters, one uppercase letter, and one number",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Generate salt for password hashing
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    // Send success response
    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (err) {

    // Handle server errors
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });

  }

});


// ================= LOGIN =================
router.post("/login", async (req, res) => {

  try {

    // Get login data from request body
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // Check if password is correct
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Create access token
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send login response
    res.status(200).json({
      message: "Login successful",
      token: accessToken,
    });

  } catch (err) {

    // Handle server errors
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });

  }

});


// ================= REFRESH TOKEN =================
router.post("/refresh", (req, res) => {

  // Get refresh token from cookies
  const refreshToken = req.cookies.refreshToken;

  // Check if refresh token exists
  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token not found",
    });
  }

  // Verify refresh token
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {

    // Check if refresh token is invalid
    if (err) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    // Create new access token
    const newAccessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // Send new access token
    res.status(200).json({
      token: newAccessToken,
    });

  });

});


// ================= LOGOUT =================
router.post("/logout", (req, res) => {

  // Clear refresh token cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
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

    // Validate email field
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save reset token and expiration time
    user.resetPasswordToken = resetToken;
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

    // Create password reset URL
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Configure email message
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      text: `Reset your password using this link: ${resetUrl}`,
    };

    // Send reset email
    await transporter.sendMail(mailOptions);

    // Send success response
    res.status(200).json({
      message: "Password reset email sent successfully",
    });

  } catch (err) {

    // Handle server errors
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });

  }

});


// ================= RESET PASSWORD =================
router.post("/reset-password/:token", async (req, res) => {

  try {

    // Get reset token from URL parameters
    const resetToken = req.params.token;

    // Get new password from request body
    const { password } = req.body;

    // Validate password strength
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 6 characters, one uppercase letter, and one number",
      });
    }

    // Find user with matching valid token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    // Check if token is valid
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // Generate salt for password hashing
    const salt = await bcrypt.genSalt(10);

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password
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
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });

  }

});


// Export router
module.exports = router;