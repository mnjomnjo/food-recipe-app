// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Security packages
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Middleware
const { verifyToken, verifyAdmin } = require("./middleware/authMiddleware");

// Models
const User = require("./models/User");
const Recipe = require("./models/Recipe");

// Routes
const authRoute = require("./routes/auth");
const recipeRoute = require("./routes/recipe");

// Initialize Express app
const app = express();


// =========================
// Security Middlewares
// =========================

// Enable secure HTTP headers
app.use(helmet());

// Prevent too many requests from the same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

app.use(limiter);


// =========================
// General Middlewares
// =========================

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());


// =========================
// API Routes
// =========================

// Authentication routes
app.use("/api/auth", authRoute);

// Recipe routes
app.use("/api/recipes", recipeRoute);


// =========================
// Protected Routes
// =========================

// Protected test route
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});

// Admin-only test route
app.get("/api/admin", verifyToken, verifyAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin 🔥",
  });
});

// Admin statistics route
app.get("/api/stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalRecipes = await Recipe.countDocuments();

    res.status(200).json({
      totalUsers,
      totalRecipes,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching statistics",
      error: err.message,
    });
  }
});


// =========================
// Database Connection
// =========================

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));


// =========================
// Test Route
// =========================

// Simple test route
app.get("/", (req, res) => {
  res.send("API is running...");
});


// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});