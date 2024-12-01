const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    frequency: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    completedDates: [
      {
        type: Date,
        // get: function (date) {
        //   return date ? date.toISOString().split("T")[0] : null;
        // },
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
