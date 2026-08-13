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
