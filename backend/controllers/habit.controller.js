import mongoose from "mongoose";
import Habit from "../models/habit.model.js";

async function findUserHabit(habitId, userId) {
  if (!mongoose.isValidObjectId(habitId)) {
    return null;
  }

  return await Habit.findOne({ _id: habitId, user: userId });
}

// Checks a day key looks like "2026-08-13".
function isValidDayKey(dayKey) {
  if (typeof dayKey !== "string") {
    return false;
  }
  return /^\d{4}-\d{2}-\d{2}$/.test(dayKey);
}

export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      data: habits,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// This function gets one habit.
export const getHabitById = async (req, res) => {
  try {
    const habit = await findUserHabit(req.params.id, req.user.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// This function adds a habit.
export const createHabit = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Habit name is required" });
    }

    const habit = await Habit.create({
      user: req.user.id,
      name: name,
      description: description || "",
      category: category || "General",
      frequency: { kind: "daily" },
      goal: 1,
      completions: [],
      archived: false,
    });

    res.status(201).json({
      success: true,
      message: "Habit created",
      data: habit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// This function updates a habit.
export const updateHabit = async (req, res) => {
  try {
    const habit = await findUserHabit(req.params.id, req.user.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const { name, description, category } = req.body;

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ message: "Habit name is required" });
      }
      habit.name = name;
    }

    if (description !== undefined) {
      habit.description = description;
    }

    if (category !== undefined) {
      habit.category = category;
    }

    await habit.save();

    res.status(200).json({
      success: true,
      message: "Habit updated",
      data: habit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// This function deletes a habit.
export const deleteHabit = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json({
      success: true,
      message: "Habit deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// This function checks in a habit for one day.
export const checkInHabit = async (req, res) => {
  try {
    const { dayKey } = req.body;

    if (!isValidDayKey(dayKey)) {
      return res
        .status(400)
        .json({ message: "A valid date is required, like 2026-08-13" });
    }

    const habit = await findUserHabit(req.params.id, req.user.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    if (!habit.completions.includes(dayKey)) {
      habit.completions.push(dayKey);
      await habit.save();
    }

    res.status(200).json({
      success: true,
      message: "Checked in",
      data: habit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// This function undoes a check-in for one day.
export const undoCheckInHabit = async (req, res) => {
  try {
    const { dayKey } = req.body;

    if (!isValidDayKey(dayKey)) {
      return res
        .status(400)
        .json({ message: "A valid date is required, like 2026-08-13" });
    }

    const habit = await findUserHabit(req.params.id, req.user.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    habit.completions = habit.completions.filter((day) => day !== dayKey);

    await habit.save();

    res.status(200).json({
      success: true,
      message: "Check-in removed",
      data: habit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
