const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  auth,
  createTokens,
  checkLogin,
  verifyRefreshToken,
} = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await checkLogin(username, password);
    const { accessToken, refreshToken } = createTokens(user._id);

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const userId = verifyRefreshToken(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = createTokens(userId);

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

router.get("/verify", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Token is valid", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
