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

    // Create new recipe
    const newRecipe = new Recipe({
      ...req.body,
      user: req.user.id,
    });

    // Save recipe to database
    const savedRecipe = await newRecipe.save();

    // Success response
    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: savedRecipe,
    });

  } catch (err) {

    // Server error response
    res.status(500).json({
      success: false,
      message: "Error creating recipe",
      error: err.message,
    });
  }
});


// ================= USER STATISTICS =================
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const totalRecipes = await Recipe.countDocuments({
      user: userId,
    });

    const avgCaloriesResult = await Recipe.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
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


// ================= ADMIN STATISTICS =================
router.get(
  "/admin/stats",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {

      const totalUsers = await User.countDocuments();

      const totalRecipes = await Recipe.countDocuments();

      const usersWithFavorites = await User.find({}, "favorites");

      const totalFavorites = usersWithFavorites.reduce((sum, user) => {
        return sum + user.favorites.length;
      }, 0);

      const ratingStats = await Recipe.aggregate([
        {
          $group: {
            _id: null,

            averageRating: {
              $avg: "$rating",
            },

            totalRatedRecipes: {
              $sum: {
                $cond: [{ $gt: ["$rating", 0] }, 1, 0],
              },
            },
          },
        },
      ]);

      res.status(200).json({
        totalUsers,
        totalRecipes,
        totalFavorites,

        averageRating:
          ratingStats.length > 0
            ? Math.round(ratingStats[0].averageRating * 10) / 10
            : 0,

        totalRatedRecipes:
          ratingStats.length > 0
            ? ratingStats[0].totalRatedRecipes
            : 0,
      });

    } catch (err) {
      res.status(500).json({
        message: "Error fetching admin statistics",
        error: err.message,
      });
    }
  }
);


// ================= GET FAVORITES =================
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


// ================= GET ALL RECIPES =================
router.get("/", async (req, res) => {
  try {
    const { search, calories, category } = req.query;

    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          ingredients: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Calories filter
    if (calories === "low") {
      query.calories = { $lt: 300 };
    } else if (calories === "medium") {
      query.calories = { $gte: 300, $lte: 600 };
    } else if (calories === "high") {
      query.calories = { $gt: 600 };
    }

    // Category filter
    if (category) {
      query.category = {
        $regex: category,
        $options: "i",
      };
    }

    const recipes = await Recipe.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json(recipes);

  } catch (err) {
    res.status(500).json({
      message: "Error fetching recipes",
      error: err.message,
    });
  }
});

// ================= RATE RECIPE =================
router.post("/:id/rate", verifyToken, async (req, res) => {
  try {

    const { rating } = req.body;

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Find recipe by ID
    const recipe = await Recipe.findById(req.params.id);

    // Check if recipe exists
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    // Update recipe rating
    recipe.rating = rating;

    await recipe.save();

    // Success response
    res.status(200).json({
      success: true,
      message: "Recipe rated successfully",
      data: recipe,
    });

  } catch (err) {

    // Server error response
    res.status(500).json({
      success: false,
      message: "Error rating recipe",
      error: err.message,
    });
  }
});


// ================= ADD FAVORITE =================
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

// ================= REMOVE FAVORITE =================
router.delete("/:id/favorite", verifyToken, async (req, res) => {
  try {

    // Find current user
    const user = await User.findById(req.user.id);

    // Remove recipe from favorites
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== req.params.id
    );

    // Save updated favorites
    await user.save();

    // Success response
    res.status(200).json({
      success: true,
      message: "Recipe removed from favorites",
      data: user.favorites,
    });

  } catch (err) {

    // Server error response
    res.status(500).json({
      success: false,
      message: "Error removing favorite",
      error: err.message,
    });
  }
});

// ================= DELETE RECIPE =================
router.delete("/:id", verifyToken, async (req, res) => {
  try {

    // Find recipe by ID
    const recipe = await Recipe.findById(req.params.id);

    // Check if recipe exists
    if (!recipe) {
      return res.status(404).json({
           success: false,
        message: "Recipe not found",
      });
    }

    // Check recipe ownership or admin role
    if (
      recipe.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
         success: false,
        message: "Unauthorized access",
      });
    }

    // Delete recipe
    await recipe.deleteOne();

    res.status(200).json({
       success: true,
      message: "Recipe deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
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

    // Check if recipe exists or user is unauthorized
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found or unauthorized",
      });
    }

    // Update recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    // Success response
    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      data: updatedRecipe,
    });

  } catch (err) {

    // Server error response
    res.status(500).json({
      success: false,
      message: "Error updating recipe",
      error: err.message,
    });
  }
});


// Export router
module.exports = router;