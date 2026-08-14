import { getTodayKey, shiftDayKey } from "./date";

// All of these work on a habit's completions array,
// which is just a list of day keys: ["2026-08-13", "2026-08-12", ...]

// This function calculates the current streak.
export function calculateCurrentStreak(completions) {
  if (completions.length === 0) {
    return 0;
  }

  const today = getTodayKey();

  // Where we start counting backwards from.
  let dayToCheck = today;

  // If today is not checked in yet, we do NOT break the streak,
  // because the day is not over. So we start from yesterday instead.
  if (!completions.includes(today)) {
    dayToCheck = shiftDayKey(today, -1);
  }

  let streak = 0;

  // Keep stepping back one day at a time while that day is completed.
  // The moment we hit a missing day, the loop stops.
  while (completions.includes(dayToCheck)) {
    streak = streak + 1;
    dayToCheck = shiftDayKey(dayToCheck, -1);
  }

  return streak;
}

// This function calculates the best streak.
export function calculateBestStreak(completions) {
  if (completions.length === 0) {
    return 0;
  }

  // Sort the days oldest first.
  // Sorting as TEXT works here because every key is "YYYY-MM-DD",
  // so alphabetical order is also date order.
  // [...completions] makes a copy so we do not change the original.
  const days = [...completions].sort();

  let best = 1;
  let running = 1;

  for (let i = 1; i < days.length; i++) {
    // What the day before this one would be.
    const dayBefore = shiftDayKey(days[i], -1);

    if (days[i - 1] === dayBefore) {
      // The previous day in the list is exactly one day earlier,
      // so the run continues.
      running = running + 1;
    } else {
      // There is a gap, so start a new run.
      running = 1;
    }

    if (running > best) {
      best = running;
    }
  }

  return best;
}

// This function calculates the completion rate over the last N days,
// as a percentage.
export function calculateCompletionRate(completions, numberOfDays) {
  const today = getTodayKey();

  let doneCount = 0;

  for (let i = 0; i < numberOfDays; i++) {
    const day = shiftDayKey(today, -i);

    if (completions.includes(day)) {
      doneCount = doneCount + 1;
    }
  }

  return Math.round((doneCount / numberOfDays) * 100);
}

// This function builds the last 7 days of progress across ALL habits.
// It returns a list like:
// [{ dayKey, label, completedCount, totalCount, percent }, ...]
export function getWeeklyProgress(habits) {
  const today = getTodayKey();
  const week = [];

  // i counts down from 6 to 0 so the oldest day comes first
  // and today ends up last.
  for (let i = 6; i >= 0; i--) {
    const dayKey = shiftDayKey(today, -i);

    // Count how many habits were completed on this day.
    let completedCount = 0;

    habits.forEach((habit) => {
      if (habit.completions.includes(dayKey)) {
        completedCount = completedCount + 1;
      }
    });

    // Work out the percentage, avoiding division by zero.
    let percent = 0;
    if (habits.length > 0) {
      percent = Math.round((completedCount / habits.length) * 100);
    }

    week.push({
      dayKey: dayKey,
      completedCount: completedCount,
      totalCount: habits.length,
      percent: percent,
    });
  }

  return week;
}

// This function finds the highest current streak across all habits.
// This is the "Current Streak" number on the dashboard.
export function getBestCurrentStreak(habits) {
  let highest = 0;

  habits.forEach((habit) => {
    const streak = calculateCurrentStreak(habit.completions);
    if (streak > highest) {
      highest = streak;
    }
  });

  return highest;
}

// This function finds the highest best streak across all habits.
export function getBestOverallStreak(habits) {
  let highest = 0;

  habits.forEach((habit) => {
    const streak = calculateBestStreak(habit.completions);
    if (streak > highest) {
      highest = streak;
    }
  });

  return highest;
}
