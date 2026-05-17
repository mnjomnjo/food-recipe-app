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

    // User role (authorization)
    role: {
      type: String,
      enum: ["user", "admin"], // Allowed values
      default: "user", // Default role
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

  // Automatically add createdAt and updatedAt
  { timestamps: true }
);

// Export User model
module.exports = mongoose.model("User", userSchema);