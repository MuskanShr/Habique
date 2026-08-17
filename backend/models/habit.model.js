import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    // Which user owns this habit.
    // ref: "User" links it to the User model.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    // Only "daily" is supported for now.
    // The object shape means we can add weekly options later
    // without changing the field type.
    frequency: {
      kind: {
        type: String,
        enum: ["daily"],
        default: "daily",
      },
    },

    goal: {
      type: Number,
      default: 1,
    },

    // The days the habit was completed, as text keys: "2026-08-13".
    // This is the SOURCE OF TRUTH.
    // We deliberately do NOT store currentStreak or bestStreak,
    // because those are calculated from this list.
    completions: {
      type: [String],
      default: [],
    },

    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;
