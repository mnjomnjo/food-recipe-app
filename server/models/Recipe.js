// Import mongoose
const mongoose = require("mongoose");

// Create recipe schema
const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // Recipe image
    image: {
      type: String,
    },

    // Recipe category
    category: {
      type: String,
    },

    ingredients: {
      type: [String],
      required: true,
    },

    instructions: {
      type: String,
      required: true,
    },

    calories: {
      type: Number,
      required: true,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Export model
module.exports = mongoose.model("Recipe", recipeSchema);