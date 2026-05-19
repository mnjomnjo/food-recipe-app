


// const express = require("express");
// const router = express.Router();
// const Recipe = require("../models/Recipe");
// const verifyToken = require("../middleware/authMiddleware");

// // Create recipe
// router.post("/", verifyToken, async (req, res) => {
//   try {
//     const newRecipe = new Recipe({
//       ...req.body,
//       user: req.user.id,
//     });

//     const savedRecipe = await newRecipe.save();
//     res.status(201).json(savedRecipe);
//   } catch (err) {
//     res.status(500).json({ message: "Error creating recipe", error: err.message });
//   }
// });

// // Get all recipes for logged-in user
// router.get("/", verifyToken, async (req, res) => {
//   try {
//     const recipes = await Recipe.find({ user: req.user.id });
//     res.status(200).json(recipes);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching recipes", error: err.message });
//   }
// });

// // Delete recipe
// router.delete("/:id", verifyToken, async (req, res) => {
//   try {
//     const recipe = await Recipe.findOne({
//       _id: req.params.id,
//       user: req.user.id,
//     });

//     if (!recipe) {
//       return res.status(404).json({ message: "Recipe not found or unauthorized" });
//     }

//     await recipe.deleteOne();
//     res.status(200).json({ message: "Recipe deleted successfully" });

//   } catch (err) {
//     res.status(500).json({ message: "Error deleting recipe", error: err.message });
//   }
// });

// // Update recipe
// router.put("/:id", verifyToken, async (req, res) => {
//   try {
//     const recipe = await Recipe.findOne({
//       _id: req.params.id,
//       user: req.user.id,
//     });

//     if (!recipe) {
//       return res.status(404).json({ message: "Recipe not found or unauthorized" });
//     }

//     const updatedRecipe = await Recipe.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true }
//     );

//     res.status(200).json(updatedRecipe);

//   } catch (err) {
//     res.status(500).json({ message: "Error updating recipe", error: err.message });
//   }
// });

// module.exports = router;




const express = require("express");
const router = express.Router();

const Recipe = require("../models/Recipe");
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/verifyAdmin");
const { getDatabaseStatistics } = require("../utils/statisticsAggregations");

// Admin statistics route
router.get(
  "/admin/stats",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const stats = await getDatabaseStatistics();

      res.status(200).json({
        totalUsers: stats.totalUsers,
        totalRecipes: stats.totalRecipes,
        totalFavorites: stats.totalFavorites,
      });
    } catch (err) {
      res.status(500).json({
        message: "Error fetching admin statistics",
        error: err.message,
      });
    }
  }
);

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
    res.status(500).json({ message: "Error creating recipe", error: err.message });
  }
});

// Get all recipes for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id });
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipes", error: err.message });
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
      return res.status(404).json({ message: "Recipe not found or unauthorized" });
    }

    await recipe.deleteOne();
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting recipe", error: err.message });
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
      return res.status(404).json({ message: "Recipe not found or unauthorized" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ message: "Error updating recipe", error: err.message });
  }
});

module.exports = router;