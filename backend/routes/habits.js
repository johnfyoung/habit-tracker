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
    importance: req.body.importance,
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
    console.log(habit);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const trackDate = new Date(date);
    console.log(`trackDate: ${trackDate}`);

    // Function to check if a date is within the habit's frequency
    const isWithinFrequency = (completedDateString) => {
      const completedDate = new Date(completedDateString);

      // Set trackDate to start of day (midnight)
      const trackDate = new Date(date);
      trackDate.setHours(0, 0, 0, 0);

      // Set completedDate to start of its day
      completedDate.setHours(0, 0, 0, 0);

      switch (habit.frequency) {
        case "daily":
          // For daily, check if it's the same calendar day
          return trackDate.getTime() === completedDate.getTime();

        case "weekly":
          const timeDiff = trackDate - completedDate;
          const daysDiff = timeDiff / (1000 * 3600 * 24);
          return daysDiff < 7 && daysDiff >= 0;

        case "monthly":
          return (
            trackDate.getFullYear() === completedDate.getFullYear() &&
            trackDate.getMonth() === completedDate.getMonth()
          );

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

router.put("/:id", auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    habit.name = req.body.name;
    habit.importance = req.body.importance;

    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
