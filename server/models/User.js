const mongoose = require("mongoose");

// User schema
const userSchema = new mongoose.Schema(
  {
    // Username
    username: {
      type: String,
      required: true,
    },

    // User email
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Hashed password
    password: {
      type: String,
      required: true,
    },

    // User role
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // User favorite recipes
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],

    // Password reset token
    resetPasswordToken: {
      type: String,
    },

    // Password reset token expiration
    resetPasswordExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Export User model
module.exports = mongoose.model("User", userSchema);