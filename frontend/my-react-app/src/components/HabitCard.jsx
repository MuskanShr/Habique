import { Link } from "react-router-dom";

// One habit shown as a card, with a check-in button.
//
// isDoneToday tells us which button to show.
// onCheckIn and onUndo are functions passed in by the page.
function HabitCard({ habit, isDoneToday, onCheckIn, onUndo, isBusy }) {
  return (
    <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
      <div className="flex-1">
        <Link
          to={`/habits/${habit._id}`}
          className="text-lg font-semibold text-red-900 hover:underline"
        >
          {habit.name}
        </Link>

        <p className="text-sm text-gray-600">{habit.description}</p>

        <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-amber-100 text-red-900">
          {habit.category}
        </span>
      </div>

      {isDoneToday ? (
        <button
          onClick={onUndo}
          disabled={isBusy}
          className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 transition disabled:opacity-50"
        >
          Done ✓
        </button>
      ) : (
        <button
          onClick={onCheckIn}
          disabled={isBusy}
          className="px-4 py-2 rounded-lg bg-amber-800 text-amber-50 hover:bg-amber-600 transition disabled:opacity-50"
        >
          Check In
        </button>
      )}
    </div>
  );
}

export default HabitCard;
