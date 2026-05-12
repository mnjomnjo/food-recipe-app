const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");


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


// Export router
module.exports = router;