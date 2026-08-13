import {
  toDateKey,
  fromDateKey,
  addDays,
  diffInDays,
  startOfWeekKey,
  eachDayOfWeek,
  isValidDateKey,
  relativeDayLabel,
} from "./date.js";

import {
  computeStreaks,
  summarizeHabits,
  getWeekProgress,
  getCompletionRate,
  isDueOn,
} from "./streaks.js";

let pass = 0;
let fail = 0;

const eq = (label, actual, expected) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);

  if (ok) {
    pass++;
    console.log(`  PASS  ${label}`);
  } else {
    fail++;
    console.log(
      `  FAIL  ${label} → got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`,
    );
  }
};

console.log(
  `\nTimezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}\n`,
);

console.log("--- Date keys ---");

const morning = new Date(2026, 7, 11, 9, 0, 0);

eq("09:00 local -> correct day key", toDateKey(morning), "2026-08-11");

const earlyBird = new Date(2026, 7, 11, 5, 30, 0);

eq("05:30 local -> correct day key", toDateKey(earlyBird), "2026-08-11");

const midnight = new Date(2026, 7, 11, 0, 15, 0);

eq("00:15 local -> correct day key", toDateKey(midnight), "2026-08-11");

eq(
  "23:50 local -> correct day key",
  toDateKey(new Date(2026, 7, 11, 23, 50)),
  "2026-08-11",
);

eq(
  "fromDateKey round trip",
  toDateKey(fromDateKey("2026-08-11")),
  "2026-08-11",
);

eq("addDays over month end", addDays("2026-08-31", 1), "2026-09-01");

eq("addDays over year end", addDays("2026-12-31", 1), "2027-01-01");

eq("addDays backwards over month", addDays("2026-03-01", -1), "2026-02-28");

eq("leap year", addDays("2028-02-28", 1), "2028-02-29");

eq("diffInDays", diffInDays("2026-08-11", "2026-08-04"), 7);

eq("diffInDays negative", diffInDays("2026-08-04", "2026-08-11"), -7);

eq("week starts Monday", startOfWeekKey("2026-08-11", 1), "2026-08-10");

eq("week starts Sunday", startOfWeekKey("2026-08-11", 0), "2026-08-09");

eq("7 days in a week", eachDayOfWeek("2026-08-11", 1).length, 7);

eq("rejects invalid date", isValidDateKey("2026-02-30"), false);

eq("accepts valid date", isValidDateKey("2026-08-11"), true);

eq(
  "relative day label",
  relativeDayLabel("2026-08-10", "2026-08-11"),
  "Yesterday",
);

const TODAY = "2026-08-11";

const opts = {
  today: TODAY,
  weekStartsOn: 1,
};

const daily = (completions, daysOfWeek = null) => ({
  frequency: {
    kind: "daily",
    daysOfWeek,
    timesPerWeek: null,
  },
  completions,
  archived: false,
});

const weekly = (completions, timesPerWeek) => ({
  frequency: {
    kind: "weekly",
    daysOfWeek: null,
    timesPerWeek,
  },
  completions,
  archived: false,
});

console.log("\n--- Daily streaks ---");

eq("no completions -> 0/0", computeStreaks(daily([]), opts), {
  currentStreak: 0,
  bestStreak: 0,
  unit: "day",
});

eq(
  "4 consecutive days including today",
  computeStreaks(
    daily(["2026-08-08", "2026-08-09", "2026-08-10", "2026-08-11"]),
    opts,
  ).currentStreak,
  4,
);

eq(
  "today unchecked keeps current streak",
  computeStreaks(daily(["2026-08-08", "2026-08-09", "2026-08-10"]), opts)
    .currentStreak,
  3,
);

eq(
  "missing yesterday breaks streak",
  computeStreaks(daily(["2026-08-07", "2026-08-08", "2026-08-09"]), opts)
    .currentStreak,
  0,
);

eq(
  "single check-in today",
  computeStreaks(daily(["2026-08-11"]), opts).currentStreak,
  1,
);

eq(
  "best streak can be greater than current streak",
  computeStreaks(
    daily([
      "2026-07-01",
      "2026-07-02",
      "2026-07-03",
      "2026-07-04",
      "2026-07-05",
      "2026-08-10",
      "2026-08-11",
    ]),
    opts,
  ),
  {
    currentStreak: 2,
    bestStreak: 5,
    unit: "day",
  },
);

eq(
  "out-of-order completions still work",
  computeStreaks(daily(["2026-08-11", "2026-08-09", "2026-08-10"]), opts)
    .currentStreak,
  3,
);

console.log("\n--- Weekday-only habit ---");

const weekdays = [1, 2, 3, 4, 5];

eq(
  "weekend is skipped for weekday habit",
  computeStreaks(
    daily(["2026-08-06", "2026-08-07", "2026-08-10", "2026-08-11"], weekdays),
    opts,
  ).currentStreak,
  4,
);

eq(
  "today unchecked still keeps weekday streak",
  computeStreaks(
    daily(["2026-08-06", "2026-08-07", "2026-08-10"], weekdays),
    opts,
  ).currentStreak,
  3,
);

eq(
  "missing Friday breaks weekday streak",
  computeStreaks(
    daily(["2026-08-06", "2026-08-10", "2026-08-11"], weekdays),
    opts,
  ).currentStreak,
  2,
);

eq("Saturday is not due", isDueOn(daily([], weekdays), "2026-08-08"), false);

eq("Monday is due", isDueOn(daily([], weekdays), "2026-08-10"), true);

console.log("\n--- Weekly habits ---");

const weeklyHabit = weekly(
  [
    "2026-06-29",
    "2026-07-01",
    "2026-07-03",

    "2026-07-06",
    "2026-07-08",
    "2026-07-10",

    "2026-07-13",
    "2026-07-15",
    "2026-07-17",

    "2026-07-21",

    "2026-07-27",
    "2026-07-29",
    "2026-07-31",

    "2026-08-03",
    "2026-08-05",
    "2026-08-07",

    "2026-08-10",
    "2026-08-11",
  ],
  3,
);

eq(
  "current week in progress",
  computeStreaks(weeklyHabit, opts).currentStreak,
  2,
);

eq("best weekly streak", computeStreaks(weeklyHabit, opts).bestStreak, 3);

eq("weekly streak unit", computeStreaks(weeklyHabit, opts).unit, "week");

console.log("\n--- Week progress and completion rate ---");

const weekProgress = getWeekProgress(daily(["2026-08-10", "2026-08-11"]), opts);

eq(
  "2 of 7 days completed",
  [weekProgress.completed, weekProgress.target],
  [2, 7],
);

eq(
  "today is correctly identified",
  weekProgress.days.find((day) => day.isToday)?.key,
  TODAY,
);

eq(
  "future days correctly identified",
  weekProgress.days.filter((day) => day.isFuture).length,
  5,
);

const completionRate = getCompletionRate(daily(["2026-08-10", "2026-08-11"]), {
  ...opts,
  days: 10,
});

eq("2 of last 10 days = 20%", completionRate.percent, 20);

console.log("\n--- Dashboard summary ---");

const summary = summarizeHabits(
  [
    daily(["2026-08-09", "2026-08-10", "2026-08-11"]),

    daily(["2026-08-10"]),

    daily(["2026-08-06", "2026-08-07"], weekdays),

    {
      ...daily(["2026-08-11"]),
      archived: true,
    },
  ],
  opts,
);

eq("archived habits excluded from total", summary.totalHabits, 3);

eq("completed today", summary.completedTodayCount, 1);

eq("habits due today", summary.dueTodayCount, 3);

eq("today completion percentage", summary.todayPercent, 33);

eq("longest active streak", summary.currentStreak, 3);

console.log(`\n${fail === 0 ? "ALL TESTS PASSED" : "SOME TESTS FAILED"}`);

console.log(`${pass} passed, ${fail} failed\n`);

process.exit(fail === 0 ? 0 : 1);
