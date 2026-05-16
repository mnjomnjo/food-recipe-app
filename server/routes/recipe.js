const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");

const getUserId = (req) => req.user?.id || req.user?._id;

// Use native driver updates so legacy users missing `name` are not blocked by full-document validation
const addFavoriteForUser = (userId, recipeObjectId) =>
  User.collection.updateOne(
    { _id: new mongoose.Types.ObjectId(userId) },
    { $addToSet: { favorites: recipeObjectId } }
  );

const removeFavoriteForUser = (userId, recipeObjectId) =>
  User.collection.updateOne(
    { _id: new mongoose.Types.ObjectId(userId) },
    { $pull: { favorites: recipeObjectId } }
  );

// ================= CREATE RECIPE =================
router.post("/", verifyToken, async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body,
      user: getUserId(req),
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

// ================= USER RECIPE STATS =================
router.get("/stats", verifyToken, async (req, res) => {
  try {
    const userId = getUserId(req);

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

// ================= GET MY FAVORITES =================
router.get("/favorites/my", verifyToken, async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(userId).select("favorites").lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const favoriteIds = (user.favorites || [])
      .map((id) => id?.toString())
      .filter((id) => id && mongoose.Types.ObjectId.isValid(id));

    if (favoriteIds.length === 0) {
      return res.status(200).json([]);
    }

    const recipes = await Recipe.find({
      _id: { $in: favoriteIds },
    }).sort({ createdAt: -1 });

    res.status(200).json(recipes);
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({
      message: "Error fetching favorites",
      error: err.message,
    });
  }
});

// ================= LIST MY RECIPES (search / calories) =================
router.get("/", verifyToken, async (req, res) => {
  try {
    const { search, calories } = req.query;

    const query = {
      user: getUserId(req),
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

// ================= RATE RECIPE =================
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

// ================= ADD TO FAVORITES =================
router.post("/:id/favorite", verifyToken, async (req, res) => {
  try {
    const userId = getUserId(req);
    const recipeId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({
        message: "Invalid recipe id",
      });
    }

    const recipeExists = await Recipe.exists({ _id: recipeId });

    if (!recipeExists) {
      return res.status(404).json({
        message: "Recipe not found",
      });
    }

    const recipeObjectId = new mongoose.Types.ObjectId(recipeId);

    const result = await addFavoriteForUser(userId, recipeObjectId);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Recipe added to favorites",
    });
  } catch (err) {
    console.error("Add favorite error:", err);
    res.status(500).json({
      message: "Error adding favorite",
      error: err.message,
    });
  }
});

// ================= REMOVE FROM FAVORITES =================
router.delete("/:id/favorite", verifyToken, async (req, res) => {
  try {
    const userId = getUserId(req);
    const recipeId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token payload",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({
        message: "Invalid recipe id",
      });
    }

    const recipeObjectId = new mongoose.Types.ObjectId(recipeId);

    const result = await removeFavoriteForUser(userId, recipeObjectId);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Recipe removed from favorites",
    });
  } catch (err) {
    console.error("Remove favorite error:", err);
    res.status(500).json({
      message: "Error removing favorite",
      error: err.message,
    });
  }
});

// ================= DELETE RECIPE =================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      user: getUserId(req),
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

// ================= UPDATE RECIPE =================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      user: getUserId(req),
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
