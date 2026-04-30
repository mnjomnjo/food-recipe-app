const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create user
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json("User created successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;