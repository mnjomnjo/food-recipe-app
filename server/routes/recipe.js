const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const verifyToken = require("../middleware/authMiddleware");

// Create recipe (protected route)
router.post("/", verifyToken, async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body,
      user: req.user.id, // 🔥 link recipe to logged-in user
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;