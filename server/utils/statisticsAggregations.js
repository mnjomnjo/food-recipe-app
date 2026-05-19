const User = require("../models/User");
const Recipe = require("../models/Recipe");

const getDatabaseStatistics = async () => {
  const totalUsers = await User.countDocuments();
  const totalRecipes = await Recipe.countDocuments();

  const totalFavoritesResult = await User.aggregate([
    { $project: { favoritesCount: { $size: "$favorites" } } },
    { $group: { _id: null, totalFavorites: { $sum: "$favoritesCount" } } },
  ]);

  const recipeStatsResult = await Recipe.aggregate([
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        averageCalories: { $avg: "$calories" },
      },
    },
  ]);

  const recipesByCategory = await Recipe.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    totalUsers,
    totalRecipes,
    totalFavorites: totalFavoritesResult[0]?.totalFavorites || 0,
    averageRating: recipeStatsResult[0]?.averageRating || 0,
    averageCalories: recipeStatsResult[0]?.averageCalories || 0,
    recipesByCategory,
  };
};

module.exports = {
  getDatabaseStatistics,
};