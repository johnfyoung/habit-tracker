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
    allowComments: req.body.allowComments || false,
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
  const { isoDate, comment, timeZone } = req.body;
  const trackDate = new Date(isoDate);

  console.log(req.body);
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.userId });
    console.log(habit);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // Function to check if a date is within the habit's frequency
    const isWithinFrequency = (completionDate, timeZone) => {
      const isoCompletedDate = new Date(completionDate);

      // Convert completedDate to user's local time
      const localCompletedDate = new Date(
        isoCompletedDate.toLocaleString("en-US", { timeZone })
      );

      // Set trackDate to start of day (midnight) in local time
      const localTrackDate = new Date(
        trackDate.toLocaleString("en-US", {
          timeZone,
        })
      );
      localTrackDate.setHours(0, 0, 0, 0);

      // Set completedDate to start of its local day
      localCompletedDate.setHours(0, 0, 0, 0);

      switch (habit.frequency) {
        case "daily":
          // For daily, check if it's the same calendar day in local time
          return localTrackDate.getTime() === localCompletedDate.getTime();

        case "weekly":
          // to check if it's the same week in local time, not with the last 7 days
          const timeDiff = localTrackDate - localCompletedDate;
          const daysDiff = timeDiff / (1000 * 3600 * 24);
          return daysDiff < 7 && daysDiff >= 0;

        case "monthly":
          return (
            trackDate.getFullYear() === localCompletedDate.getFullYear() &&
            trackDate.getMonth() === localCompletedDate.getMonth()
          );

        default:
          return false;
      }
    };

    // Check both completedDates and completions for existing entries
    const lastCompletedDate = habit.completedDates
      .filter((d) => isWithinFrequency(d, timeZone))
      .sort((a, b) => new Date(b) - new Date(a))[0];

    const lastCompletion = habit.completions
      ?.filter((completion) => isWithinFrequency(completion.date, timeZone))
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (lastCompletedDate || lastCompletion) {
      // If completed within timeframe, remove it (untrack)
      if (lastCompletedDate) {
        habit.completedDates = habit.completedDates.filter(
          (d) => d.getTime() !== lastCompletedDate.getTime()
        );
      }
      if (lastCompletion) {
        habit.completions = habit.completions.filter(
          (completion) =>
            completion.date.getTime() !== lastCompletion.date.getTime()
        );
      }
    } else {
      // If not completed within timeframe, add new completion
      if (habit.allowComments && comment) {
        // If comments are enabled and provided, use completions
        habit.completions.push({
          date: trackDate,
          comment: comment,
        });
      } else {
        // Otherwise use the traditional completedDates
        habit.completedDates.push(trackDate);
      }
    }

    await habit.save();
    res.json(habit);
  } catch (error) {
    console.error("Error toggling habit:", error);
    res.status(500).json({ message: "Error toggling habit" });
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
    habit.allowComments = req.body.allowComments || false;

    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
