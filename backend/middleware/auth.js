const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

const createTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};

const checkLogin = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

const verifyRefreshToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    return decoded.id;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

module.exports = { auth, createTokens, checkLogin, verifyRefreshToken };
