// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Security packages
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Middleware
const { verifyToken, verifyAdmin } = require("./middleware/authMiddleware");

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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: "Too many requests, please try again later.",
});

app.use(limiter);


// =========================
// General Middlewares
// =========================

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse JSON request bodies
app.use(express.json());


// =========================
// API Routes
// =========================

// Authentication routes
app.use("/api/auth", authRoute);

// Recipe routes
app.use("/api/recipes", recipeRoute);


// =========================
// Protected Route Example
// =========================

// Only authenticated users can access this route
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});

// Admin-only route
app.get("/api/admin", verifyToken, verifyAdmin, (req, res) => {
  res.json({
    message: "Welcome Admin 🔥",
  });
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

app.get("/", (req, res) => {
  res.send("API is running...");
});


// =========================
// Start Server
// =========================

// Define server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});