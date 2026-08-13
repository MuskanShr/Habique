import { getTodayKey, addDays } from "../lib/date";

// This file pretends to be the database for Phase 1.
// It saves habits in localStorage so they survive a page refresh.
//
// The habits are saved PER USER. If two people log in on the same
// browser, they each get their own list instead of sharing one.

// Builds the localStorage key for one user, e.g. "habique_habits_65f1a..."
function getStorageKey(userId) {
  return `habique_habits_${userId}`;
}

// The habits a brand new user starts with, so the app is not empty.
function getStarterHabits() {
  return [
    {
      _id: "1",
      name: "Drink Water",
      description: "Drink 8 glasses of water",
      category: "Health",
      frequency: { kind: "daily" },
      goal: 1,
      completions: [getTodayKey(), addDays(-1), addDays(-2)],
      archived: false,
    },
    {
      _id: "2",
      name: "Read a Book",
      description: "Read for 20 minutes",
      category: "Learning",
      frequency: { kind: "daily" },
      goal: 1,
      completions: [addDays(-1), addDays(-2)],
      archived: false,
    },
    {
      _id: "3",
      name: "Morning Walk",
      description: "Walk for 30 minutes",
      category: "Fitness",
      frequency: { kind: "daily" },
      goal: 1,
      completions: [],
      archived: false,
    },
  ];
}

// Reads this user's habits out of localStorage.
export function loadHabits(userId) {
  const savedText = localStorage.getItem(getStorageKey(userId));

  // Nothing saved yet, so give them the starter habits and save those.
  if (!savedText) {
    const starterHabits = getStarterHabits();
    saveHabits(userId, starterHabits);
    return starterHabits;
  }

  try {
    return JSON.parse(savedText);
  } catch (error) {
    // The saved text was damaged, so start fresh instead of crashing.
    return [];
  }
}

// Writes this user's habits into localStorage.
export function saveHabits(userId, habits) {
  // localStorage can only hold text, so we convert the array to text.
  localStorage.setItem(getStorageKey(userId), JSON.stringify(habits));
}

// Removes this user's saved habits. Used by the Settings reset button.
export function clearHabits(userId) {
  localStorage.removeItem(getStorageKey(userId));
}
