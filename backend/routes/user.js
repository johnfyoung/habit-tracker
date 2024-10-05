const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ name: user.name, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  const { name, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    if (name) user.username = name;
    if (password) {
      user.password = await bcrypt.hash(password, 10); // Hash the password
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
