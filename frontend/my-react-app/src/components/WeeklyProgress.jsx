import { getWeekdayLabel } from "../lib/date";

// Shows the last 7 days as vertical bars.
// "week" comes from getWeeklyProgress() in streaks.js.
function WeeklyProgress({ week }) {
  return (
    <div className="bg-white rounded-2xl p-5 mb-6">
      <h2 className="font-semibold text-red-900 mb-4">Weekly Progress</h2>

      <div className="flex items-end justify-between gap-2 h-40">
        {week.map((day) => (
          <div key={day.dayKey} className="flex-1 flex flex-col items-center">
            {/* The number completed that day */}
            <span className="text-xs text-gray-600 mb-1">
              {day.completedCount}/{day.totalCount}
            </span>

            {/* The bar itself. It grows from the bottom.
                We give it a small minimum height so a 0% day
                is still visible as a thin line. */}
            <div className="w-full h-24 bg-amber-100 rounded-lg flex items-end">
              <div
                className="w-full bg-amber-800 rounded-lg"
                style={{ height: `${day.percent}%`, minHeight: "4px" }}
              ></div>
            </div>

            <span className="text-xs text-gray-600 mt-2">
              {getWeekdayLabel(day.dayKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyProgress;
