require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const habitRoutes = require("./routes/habits");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/habit-tracker";

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API routes
app.use("/api/habits", habitRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Serve static files and handle SPA routing only in production
if (process.env.NODE_ENV === "production") {
  // Adjust the path to point to the frontend/dist directory
  app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

  // Catch-all route for SPA
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
