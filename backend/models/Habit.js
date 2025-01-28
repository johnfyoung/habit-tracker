const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    frequency: { type: String, required: true },
    importance: {
      type: Number,
      required: true,
      min: -10,
      max: 10,
      default: 0,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    completedDates: [
      {
        type: Date,
      },
    ],
    allowComments: {
      type: Boolean,
      default: false,
    },
    completions: [
      {
        date: {
          type: Date,
          required: true,
        },
        comment: {
          type: String,
          default: "",
        },
      },
    ],
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { currentTime: () => new Date().toUTCString() },
  }
);

// If using this getter, make sure to enable it when converting to JSON
habitSchema.set("toJSON", { getters: true });

module.exports = mongoose.model("Habit", habitSchema);
