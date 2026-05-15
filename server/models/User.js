const mongoose = require("mongoose");

// User schema
const userSchema = new mongoose.Schema(
  {
    // Display name (register sends `username` → stored as `name` in auth route)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // User email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // Hashed password
    password: {
      type: String,
      required: true,
    },

    // User role (authorization)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    resetPasswordToken: String,

    resetPasswordExpire: Date,

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },

  // Automatically add createdAt and updatedAt
  { timestamps: true }
);

// Export User model
module.exports = mongoose.model("User", userSchema);
