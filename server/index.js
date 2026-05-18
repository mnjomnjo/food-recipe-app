// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { verifyToken } = require("./middleware/authMiddleware");
const recipeRoute = require("./routes/recipe");

// Initialize Express app
const app = express();

// Import routes
const authRoute = require("./routes/auth");

// Middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use("/api/auth", authRoute); // Authentication routes
app.use("/api/recipes", recipeRoute);

// Protected route (only logged-in users can access)
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Define server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});