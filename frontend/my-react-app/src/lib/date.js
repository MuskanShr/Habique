// All habit days are stored as a plain text key like "2026-08-13".
//
// IMPORTANT: we build this key from LOCAL date parts, not from
// toISOString(). Nepal is UTC+5:45, so at 1:00 AM local time the
// UTC date is still YESTERDAY. Using toISOString() would file a
// late-night check-in under the wrong day.

// Turns a Date object into a "YYYY-MM-DD" text key.
export function toDayKey(date) {
  const year = date.getFullYear();

  // getMonth() returns 0 for January, so we add 1.
  // padStart(2, "0") turns "8" into "08" so the length is always the same.
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// The key for today.
export function getTodayKey() {
  return toDayKey(new Date());
}

// The key for a day a number of days away from today.
// addDays(-1) gives yesterday, addDays(1) gives tomorrow.
export function addDays(numberOfDays) {
  const date = new Date();
  date.setDate(date.getDate() + numberOfDays);
  return toDayKey(date);
}

// A friendly date for the dashboard, e.g. "Thursday, 13 August 2026".
export function getTodayLabel() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ---------- added in Step 1C ----------

// Turns a "2026-08-13" key back into a Date object.
//
// We split the text and build the date from numbers instead of
// writing new Date("2026-08-13"). That shorter version is read as
// UTC midnight, which in Nepal (UTC+5:45) is 5:45 AM the SAME day
// but can land on the wrong day for other timezones. Building it
// from parts always gives local midnight, which is what we want.
export function dayKeyToDate(dayKey) {
  const parts = dayKey.split("-");

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  // month - 1 because January is 0 in JavaScript.
  return new Date(year, month - 1, day);
}

// Moves a day key forwards or backwards.
// shiftDayKey("2026-08-13", -1) gives "2026-08-12".
export function shiftDayKey(dayKey, numberOfDays) {
  const date = dayKeyToDate(dayKey);
  date.setDate(date.getDate() + numberOfDays);
  return toDayKey(date);
}

// Short weekday name for a day key, e.g. "Thu".
export function getWeekdayLabel(dayKey) {
  const date = dayKeyToDate(dayKey);
  return date.toLocaleDateString("en-GB", { weekday: "short" });
}
