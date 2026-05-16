const Recipe = require("../models/Recipe");

const getAverageCalories = async () => {
  return await Recipe.aggregate([
    {
      $group: {
        _id: null,
        averageCalories: { $avg: "$calories" },
      },
    },
  ]);
};

const getRecipeCountByUser = async () => {
  return await Recipe.aggregate([
    {
      $group: {
        _id: "$createdBy",
        totalRecipes: { $sum: 1 },
      },
    },
  ]);
};

module.exports = {
  getAverageCalories,
  getRecipeCountByUser,
};
