const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");
const User = require("../models/User");

const {
  verifyToken,
  verifyAdmin,
} = require("../middleware/authMiddleware");


// ================= CREATE RECIPE =================
router.post("/", verifyToken, async (req, res) => {

  try {

    // Create new recipe linked to logged-in user
    const newRecipe = new Recipe({
      ...req.body,
      user: req.user.id,
    });

    // Save recipe to database
    const savedRecipe = await newRecipe.save();

    // Send success response
    res.status(201).json(savedRecipe);

  } catch (err) {

    // Handle server errors
    res.status(500).json({
      message: "Error creating recipe",
      error: err.message,
    });

  }

});

// Get statistics for user's recipes
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalRecipes = await Recipe.countDocuments({ user: userId });

    const avgCaloriesResult = await Recipe.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          avgCalories: { $avg: "$calories" },
        },
      },
    ]);

    const avgCalories =
      avgCaloriesResult.length > 0
        ? Math.round(avgCaloriesResult[0].avgCalories)
        : 0;

    const low = await Recipe.countDocuments({
      user: userId,
      calories: { $lt: 300 },
    });

    const medium = await Recipe.countDocuments({
      user: userId,
      calories: { $gte: 300, $lte: 600 },
    });

    const high = await Recipe.countDocuments({
      user: userId,
      calories: { $gt: 600 },
    });

    res.status(200).json({
      totalRecipes,
      avgCalories,
      lowCalories: low,
      mediumCalories: medium,
      highCalories: high,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching stats",
      error: err.message,
    });
  }
});

// Get my favorite recipes
router.get("/favorites/my", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");

    res.status(200).json(user.favorites);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching favorites",
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


// ================= GET ALL RECIPES =================
// Public route (no login required)
router.get("/", async (req, res) => {

  try {

    // Fetch all recipes
    const recipes = await Recipe.find();

    // Send recipes response
    res.status(200).json(recipes);

  } catch (err) {

    // Handle server errors
    res.status(500).json({
      message: "Error fetching recipes",
      error: err.message,
    });
  }
});

// Rate a recipe
router.post("/:id/rate", verifyToken, async (req, res) => {
  try {
    const { rating } = req.body;

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

// Add recipe to favorites
router.post("/:id/favorite", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.favorites.includes(req.params.id)) {
      return res.status(400).json({
        message: "Recipe already in favorites",
      });
    }

    user.favorites.push(req.params.id);
    await user.save();

    res.status(200).json({
      message: "Recipe added to favorites",
      favorites: user.favorites,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error adding favorite",
      error: err.message,
    });
  }
});

// Remove recipe from favorites
router.delete("/:id/favorite", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== req.params.id
    );

    await user.save();

    res.status(200).json({
      message: "Recipe removed from favorites",
      favorites: user.favorites,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error removing favorite",
      error: err.message,
    });

  }

});


// ================= DELETE RECIPE =================
router.delete("/:id", verifyToken, async (req, res) => {

  try {

    // Find recipe by ID and owner
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    // Check if recipe exists
    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found or unauthorized",
      });
    }

    // Delete recipe
    await recipe.deleteOne();

    // Send success response
    res.status(200).json({
      message: "Recipe deleted successfully",
    });

    res.status(200).json({
      message: "Recipe deleted successfully",
    });
  } catch (err) {

    // Handle server errors
    res.status(500).json({
      message: "Error deleting recipe",
      error: err.message,
    });

  }

});


// ================= UPDATE RECIPE =================
router.put("/:id", verifyToken, async (req, res) => {

  try {

    // Find recipe by ID and owner
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    // Check if recipe exists
    if (!recipe) {
      return res.status(404).json({
        message: "Recipe not found or unauthorized",
      });
    }

    // Update recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    // Send updated recipe
    res.status(200).json(updatedRecipe);
  } catch (err) {

    // Handle server errors
    res.status(500).json({
      message: "Error updating recipe",
      error: err.message,
    });

  }

});


// ================= ADD TO FAVORITES =================
router.post("/:id/favorite", verifyToken, async (req, res) => {

  try {

    // Find current user
    const user = await User.findById(req.user.id);

    // Check if recipe already exists in favorites
    if (user.favorites.includes(req.params.id)) {
      return res.status(400).json({
        message: "Recipe already in favorites",
      });
    }

    // Add recipe to favorites
    user.favorites.push(req.params.id);

    // Save updated user
    await user.save();

    // Send success response
    res.status(200).json({
      message: "Recipe added to favorites",
      favorites: user.favorites,
    });

  } catch (err) {

    // Handle server errors
    res.status(500).json({
      message: "Error adding favorite",
      error: err.message,
    });

  }

});


// ================= REMOVE FROM FAVORITES =================
router.delete("/:id/favorite", verifyToken, async (req, res) => {

  try {

    // Find current user
    const user = await User.findById(req.user.id);

    // Remove recipe from favorites
    user.favorites = user.favorites.filter(
      (favorite) => favorite.toString() !== req.params.id
    );

    // Save updated user
    await user.save();

    // Send success response
    res.status(200).json({
      message: "Recipe removed from favorites",
      favorites: user.favorites,
    });

  } catch (err) {

    // Handle server errors
    res.status(500).json({
      message: "Error removing favorite",
      error: err.message,
    });

  }

});


// ================= GET USER FAVORITES =================
router.get("/favorites/my", verifyToken, async (req, res) => {

  try {

    // Find logged-in user and populate favorite recipes
    const user = await User.findById(req.user.id).populate("favorites");

    // Send favorites response
    res.status(200).json({
      favorites: user.favorites,
    });

  } catch (err) {

    // Handle server errors
    res.status(500).json({
      message: "Error fetching favorites",
      error: err.message,
    });

  }

});


// ================= ADMIN STATISTICS =================
router.get(
  "/admin/stats",
  verifyToken,
  verifyAdmin,
  async (req, res) => {

    try {

      // Count total recipes
      const totalRecipes = await Recipe.countDocuments();

      // Count total users
      const totalUsers = await User.countDocuments();

      // Send statistics response
      res.status(200).json({
        message: "Admin statistics fetched successfully",
        totalRecipes,
        totalUsers,
      });

    } catch (err) {

      // Handle server errors
      res.status(500).json({
        message: "Error fetching statistics",
        error: err.message,
      });

    }

  }
);


// Export router
module.exports = router;