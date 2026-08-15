import { Link } from "react-router-dom";

function HabitCard({
  habit,
  isDoneToday,
  onCheckIn,
  onUndo,
  isBusy,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-50">
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

      <div className="flex items-center gap-2">
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

        {/* These only show if the page passed the function in. */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-3 py-2 rounded-lg bg-amber-100 text-red-900 hover:bg-amber-200 transition"
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="px-3 py-2 rounded-lg bg-red-100 text-red-900 hover:bg-red-200 transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default HabitCard;
