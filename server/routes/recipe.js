const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const verifyToken = require("../middleware/authMiddleware");

// Create recipe
router.post("/", verifyToken, async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body,
      user: req.user.id,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(500).json({
      message: "Error creating recipe",
      error: err.message,
    });
  }
});

// Get recipes for logged-in user with optional search and calorie filter
router.get("/", verifyToken, async (req, res) => {
  try {
    const { search, calories } = req.query;

    const query = {
      user: req.user.id,
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { ingredients: { $regex: search, $options: "i" } },
      ];
    }

    if (calories === "low") {
      query.calories = { $lt: 300 };
    } else if (calories === "medium") {
      query.calories = { $gte: 300, $lte: 600 };
    } else if (calories === "high") {
      query.calories = { $gt: 600 };
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });

    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching recipes",
      error: err.message,
    });
  }
});

// Delete recipe
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found or unauthorized",
      });
    }

    await recipe.deleteOne();

    res.status(200).json({
      message: "Recipe deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting recipe",
      error: err.message,
    });
  }
});

// Update recipe
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found or unauthorized",
      });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(500).json({
      message: "Error updating recipe",
      error: err.message,
    });
  }
});

module.exports = router;
// Rate a recipe
router.post("/:id/rate", verifyToken, async (req, res) => {
  try {
    const { rating } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    // Update rating
    recipe.rating = rating;

    await recipe.save();

    res.status(200).json({
      message: "Recipe rated successfully",
      recipe,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error rating recipe",
      error: err.message,
    });
  }
});