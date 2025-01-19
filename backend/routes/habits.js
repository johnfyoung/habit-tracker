const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const { auth } = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.userId });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  const habit = new Habit({
    name: req.body.name,
    frequency: req.body.frequency,
    user: req.userId,
  });

  try {
    const newHabit = await habit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// Add more routes for updating and deleting habits, using the auth middleware

router.post("/:id/toggle", auth, async (req, res) => {
  try {
    const { date } = req.body;
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const trackDate = new Date(date);
    console.log(`trackDate: ${trackDate}`);

    // Function to check if a date is within the habit's frequency
    const isWithinFrequency = (completedDateString) => {
      // console.log(`Checking freq...${completedDateString}`);
      const completedDate = new Date(completedDateString);
      console.log(`completedDate: ${completedDate}`);
      const timeDiff = trackDate - completedDate;
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      // console.log(`daysDiff: ${daysDiff}`);
      // console.log(`timeDiff: ${timeDiff}`);

      switch (habit.frequency) {
        case "daily":
          return daysDiff < 1 && daysDiff >= 0;
        case "weekly":
          return daysDiff < 7 && daysDiff >= 0;
        case "monthly":
          // Approximate a month as 30 days
          return daysDiff < 30 && daysDiff >= 0;
        default:
          return false;
      }
    };

    // Find the last completed date within the habit's time frame
    const lastCompletedDate = habit.completedDates
      .filter(isWithinFrequency)
      .sort((a, b) => new Date(b) - new Date(a))[0];

    console.log("lastCompletedDate", lastCompletedDate);
    if (lastCompletedDate) {
      // If a completed date was found within the time frame, remove it (untrack)
      habit.completedDates = habit.completedDates.filter(
        (d) => d !== lastCompletedDate
      );
    } else {
      // If no completed date was found within the time frame, add the new date (track)
      habit.completedDates.push(trackDate.toISOString());
    }

    await habit.save();
    res.json(habit);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

router.post("/:id/toggle-archive", auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    habit.archived = !habit.archived;
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
