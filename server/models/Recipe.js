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

    ingredients: {
      type: [String], // array of strings
      required: true,
    },

    instructions: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link recipe to user
      required: true,
    },
  },
  { timestamps: true }
);

// Export model
module.exports = mongoose.model("Recipe", recipeSchema);