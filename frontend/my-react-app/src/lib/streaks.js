import {
  addDays,
  compareDateKeys,
  dayOfWeek,
  diffInDays,
  eachDayOfWeek,
  lastNDays,
  startOfWeekKey,
  todayKey,
  weekKeyOf,
} from "./date.js";

export const DEFAULT_WEEK_STARTS_ON = 1; // Monday

/* ------------------------------------------------------------- primitives */

function completionSet(habit) {
  return new Set(habit?.completions ?? []);
}

function sortedCompletions(habit) {
  return [...(habit?.completions ?? [])].sort(compareDateKeys);
}

/** Is this habit scheduled on this day? Weekly habits accept any day. */
export function isDueOn(habit, key) {
  const frequency = habit?.frequency ?? { kind: "daily" };
  if (frequency.kind === "weekly") return true;
  const days = frequency.daysOfWeek;
  if (!Array.isArray(days) || days.length === 0 || days.length >= 7)
    return true;
  return days.includes(dayOfWeek(key));
}

/** Was this habit checked in on this day? */
export function isCompletedOn(habit, key) {
  return completionSet(habit).has(key);
}

export function isCompletedToday(habit, today = todayKey()) {
  return isCompletedOn(habit, today);
}

export function streakUnit(habit) {
  return habit?.frequency?.kind === "weekly" ? "week" : "day";
}

function weeklyTarget(habit) {
  const target = Number(habit?.frequency?.timesPerWeek);
  return Number.isFinite(target) && target > 0 ? Math.floor(target) : 1;
}

/* ------------------------------------------------------------ daily logic */

function dailyCurrentStreak(habit, today) {
  const done = completionSet(habit);
  if (done.size === 0) return 0;

  const earliest = sortedCompletions(habit)[0];
  let cursor = today;

  // Decision B: today is still in progress, so an unchecked today is not a miss.
  if (isDueOn(habit, cursor) && !done.has(cursor)) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  while (diffInDays(cursor, earliest) >= 0) {
    if (!isDueOn(habit, cursor)) {
      cursor = addDays(cursor, -1); // not scheduled — step over it
      continue;
    }
    if (!done.has(cursor)) break; // a scheduled day was missed
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function dailyBestStreak(habit, today) {
  const done = completionSet(habit);
  if (done.size === 0) return 0;

  let cursor = sortedCompletions(habit)[0];
  let best = 0;
  let run = 0;

  while (diffInDays(today, cursor) >= 0) {
    if (isDueOn(habit, cursor)) {
      if (done.has(cursor)) {
        run += 1;
        if (run > best) best = run;
      } else if (cursor !== today) {
        run = 0; // today is still open, so it can't end a run yet
      }
    }
    cursor = addDays(cursor, 1);
  }
  return best;
}

/* ----------------------------------------------------------- weekly logic */

function weeklyCounts(habit, weekStartsOn) {
  const counts = new Map();
  for (const key of habit?.completions ?? []) {
    const week = weekKeyOf(key, weekStartsOn);
    counts.set(week, (counts.get(week) ?? 0) + 1);
  }
  return counts;
}

function weeklyCurrentStreak(habit, today, weekStartsOn) {
  const target = weeklyTarget(habit);
  const counts = weeklyCounts(habit, weekStartsOn);
  if (counts.size === 0) return 0;

  const earliestWeek = [...counts.keys()].sort(compareDateKeys)[0];
  let cursor = startOfWeekKey(today, weekStartsOn);

  // Decision B, weekly form: the current week is still in progress.
  if ((counts.get(cursor) ?? 0) < target) {
    cursor = addDays(cursor, -7);
  }

  let streak = 0;
  while (diffInDays(cursor, earliestWeek) >= 0) {
    if ((counts.get(cursor) ?? 0) < target) break;
    streak += 1;
    cursor = addDays(cursor, -7);
  }
  return streak;
}

function weeklyBestStreak(habit, today, weekStartsOn) {
  const target = weeklyTarget(habit);
  const counts = weeklyCounts(habit, weekStartsOn);
  if (counts.size === 0) return 0;

  const currentWeek = startOfWeekKey(today, weekStartsOn);
  let cursor = [...counts.keys()].sort(compareDateKeys)[0];
  let best = 0;
  let run = 0;

  while (diffInDays(currentWeek, cursor) >= 0) {
    if ((counts.get(cursor) ?? 0) >= target) {
      run += 1;
      if (run > best) best = run;
    } else if (cursor !== currentWeek) {
      run = 0; // the in-progress week can't end a run yet
    }
    cursor = addDays(cursor, 7);
  }
  return best;
}

/* ---------------------------------------------------------------- public */

/** { currentStreak, bestStreak, unit } for one habit. */
export function computeStreaks(habit, options = {}) {
  const today = options.today ?? todayKey();
  const weekStartsOn = options.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON;
  const weekly = habit?.frequency?.kind === "weekly";

  return {
    currentStreak: weekly
      ? weeklyCurrentStreak(habit, today, weekStartsOn)
      : dailyCurrentStreak(habit, today),
    bestStreak: weekly
      ? weeklyBestStreak(habit, today, weekStartsOn)
      : dailyBestStreak(habit, today),
    unit: weekly ? "week" : "day",
  };
}

/** Current-week breakdown for the 7-day strip on a habit card. */
export function getWeekProgress(habit, options = {}) {
  const today = options.today ?? todayKey();
  const weekStartsOn = options.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON;
  const done = completionSet(habit);

  const days = eachDayOfWeek(today, weekStartsOn).map((key) => ({
    key,
    due: isDueOn(habit, key),
    completed: done.has(key),
    isToday: key === today,
    isFuture: diffInDays(key, today) > 0,
  }));

  const completed = days.filter((day) => day.completed).length;
  const target =
    habit?.frequency?.kind === "weekly"
      ? weeklyTarget(habit)
      : days.filter((day) => day.due).length;

  return {
    days,
    completed,
    target,
    percent:
      target === 0 ? 0 : Math.min(100, Math.round((completed / target) * 100)),
  };
}

/** Share of scheduled days actually completed over the trailing window. */
export function getCompletionRate(habit, options = {}) {
  const today = options.today ?? todayKey();
  const windowDays = options.days ?? 30;
  const done = completionSet(habit);

  let due = 0;
  let completed = 0;
  for (const key of lastNDays(windowDays, today)) {
    if (habit?.frequency?.kind === "weekly") {
      due += 1;
      if (done.has(key)) completed += 1;
      continue;
    }
    if (!isDueOn(habit, key)) continue;
    due += 1;
    if (done.has(key)) completed += 1;
  }

  return {
    due,
    completed,
    percent: due === 0 ? 0 : Math.round((completed / due) * 100),
  };
}

/** Everything one habit card or detail page needs, in one call. */
export function getHabitStats(habit, options = {}) {
  const today = options.today ?? todayKey();
  return {
    ...computeStreaks(habit, options),
    dueToday: isDueOn(habit, today),
    completedToday: isCompletedOn(habit, today),
    week: getWeekProgress(habit, options),
    rate: getCompletionRate(habit, options),
    totalCompletions: habit?.completions?.length ?? 0,
  };
}

/** Dashboard aggregate across every active habit (decision D). */
export function summarizeHabits(habits = [], options = {}) {
  const today = options.today ?? todayKey();
  const active = habits.filter((habit) => !habit.archived);

  const dueToday = active.filter((habit) => isDueOn(habit, today));
  const completedToday = dueToday.filter((habit) =>
    isCompletedOn(habit, today),
  );

  let currentStreak = 0;
  let bestStreak = 0;
  for (const habit of active) {
    const streaks = computeStreaks(habit, options);
    if (streaks.currentStreak > currentStreak)
      currentStreak = streaks.currentStreak;
    if (streaks.bestStreak > bestStreak) bestStreak = streaks.bestStreak;
  }

  return {
    totalHabits: active.length,
    dueTodayCount: dueToday.length,
    completedTodayCount: completedToday.length,
    todayPercent:
      dueToday.length === 0
        ? 0
        : Math.round((completedToday.length / dueToday.length) * 100),
    currentStreak,
    bestStreak,
  };
}

/** Per-day totals for the dashboard's weekly progress chart. */
export function getWeeklyOverview(habits = [], options = {}) {
  const today = options.today ?? todayKey();
  const weekStartsOn = options.weekStartsOn ?? DEFAULT_WEEK_STARTS_ON;
  const active = habits.filter((habit) => !habit.archived);

  const days = eachDayOfWeek(today, weekStartsOn).map((key) => {
    const due = active.filter((habit) => isDueOn(habit, key));
    const completed = due.filter((habit) => isCompletedOn(habit, key));
    return {
      key,
      due: due.length,
      completed: completed.length,
      isToday: key === today,
      isFuture: diffInDays(key, today) > 0,
      percent:
        due.length === 0
          ? 0
          : Math.round((completed.length / due.length) * 100),
    };
  });

  const totalDue = days.reduce(
    (sum, day) => (day.isFuture ? sum : sum + day.due),
    0,
  );
  const totalCompleted = days.reduce((sum, day) => sum + day.completed, 0);

  return {
    days,
    totalDue,
    totalCompleted,
    percent: totalDue === 0 ? 0 : Math.round((totalCompleted / totalDue) * 100),
  };
}
