import { loadHabits, saveHabits } from "./mockDb";

// This is the ONLY file that knows where habits come from.
// Right now it reads from mockDb (localStorage).
// In Phase 3 we replace the inside of these functions with fetch()
// calls to Express. The pages and hooks will not change at all.
//
// Every function is async even though localStorage is instant,
// because a real API call will be async. Writing them async now
// means nothing breaks later.

// This function gets all habits.
export async function getHabits(userId) {
  return loadHabits(userId);
}

// This function gets one habit by its id.
export async function getHabitById(userId, habitId) {
  const habits = loadHabits(userId);

  // find() returns the first habit whose _id matches.
  const habit = habits.find((h) => h._id === habitId);

  if (!habit) {
    throw new Error("Habit not found");
  }

  return habit;
}

// This function adds a habit.
export async function createHabit(userId, newHabit) {
  const habits = loadHabits(userId);

  const habit = {
    // Date.now() gives a number that is different every time,
    // so it works as a temporary id until MongoDB gives us a real one.
    _id: String(Date.now()),
    name: newHabit.name,
    description: newHabit.description,
    category: newHabit.category,
    frequency: { kind: "daily" },
    goal: 1,
    completions: [],
    archived: false,
  };

  habits.push(habit);
  saveHabits(userId, habits);

  return habit;
}

// This function updates a habit.
export async function updateHabit(userId, habitId, changes) {
  const habits = loadHabits(userId);

  const habit = habits.find((h) => h._id === habitId);

  if (!habit) {
    throw new Error("Habit not found");
  }

  habit.name = changes.name;
  habit.description = changes.description;
  habit.category = changes.category;

  saveHabits(userId, habits);

  return habit;
}

// This function deletes a habit.
export async function deleteHabit(userId, habitId) {
  const habits = loadHabits(userId);

  // filter() keeps every habit EXCEPT the one we are deleting.
  const remaining = habits.filter((h) => h._id !== habitId);

  saveHabits(userId, remaining);

  return { success: true };
}

// This function checks in a habit for one day.
export async function checkInHabit(userId, habitId, dayKey) {
  const habits = loadHabits(userId);

  const habit = habits.find((h) => h._id === habitId);

  if (!habit) {
    throw new Error("Habit not found");
  }

  // Only add the day if it is not already there,
  // so checking in twice does not create a duplicate.
  if (!habit.completions.includes(dayKey)) {
    habit.completions.push(dayKey);
  }

  saveHabits(userId, habits);

  return habit;
}

// This function undoes a check-in for one day.
export async function undoCheckInHabit(userId, habitId, dayKey) {
  const habits = loadHabits(userId);

  const habit = habits.find((h) => h._id === habitId);

  if (!habit) {
    throw new Error("Habit not found");
  }

  // Keep every day EXCEPT the one we are removing.
  habit.completions = habit.completions.filter((day) => day !== dayKey);

  saveHabits(userId, habits);

  return habit;
}
