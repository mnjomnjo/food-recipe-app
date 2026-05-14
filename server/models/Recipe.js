const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    // ADD IMAGE FIELD
    image: {
      type: String,
    },

    image: {
      type: String,
      default: "",
    },

    ingredients: [
      {
        type: String,
        required: true,
      },
    ],

    instructions: {
      type: String,
      required: true,
    },

    calories: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    category: {
      type: String,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

recipeSchema.index({
  title: "text",
  description: "text",
  ingredients: "text",
});

module.exports = mongoose.model("Recipe", recipeSchema);