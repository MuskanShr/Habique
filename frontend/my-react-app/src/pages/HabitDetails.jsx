import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useHabit,
  useDeleteHabit,
  useCheckIn,
  useUndoCheckIn,
} from "../hooks/useHabits";
import { getTodayKey, shiftDayKey, getWeekdayLabel } from "../lib/date";
import {
  calculateCurrentStreak,
  calculateBestStreak,
  calculateCompletionRate,
} from "../lib/streaks";
import StatCard from "../components/StatCard";
import ConfirmDialog from "../components/ConfirmDialog";
import Spinner from "../components/Spinner";

function HabitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const today = getTodayKey();

  const { data: habit, isLoading, isError } = useHabit(id);

  const deleteHabit = useDeleteHabit();
  const checkIn = useCheckIn();
  const undoCheckIn = useUndoCheckIn();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  //  deletes the habit and goes back to the list.
  const handleConfirmDelete = () => {
    deleteHabit.mutate(id);
    setShowDeleteDialog(false);
    navigate("/habits");
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div>
        <p className="text-red-800 mb-4">This habit could not be found.</p>
        <Link to="/habits" className="text-blue-600 hover:underline">
          Back to My Habits
        </Link>
      </div>
    );
  }

  const isDoneToday = habit.completions.includes(today);

  const currentStreak = calculateCurrentStreak(habit.completions);
  const bestStreak = calculateBestStreak(habit.completions);
  const completionRate = calculateCompletionRate(habit.completions, 30);

  const recentDays = [];
  for (let i = 13; i >= 0; i--) {
    const dayKey = shiftDayKey(today, -i);
    recentDays.push({
      dayKey: dayKey,
      isDone: habit.completions.includes(dayKey),
    });
  }

  return (
    <div>
      <Link to="/habits" className="text-blue-600 hover:underline">
        ← Back to My Habits
      </Link>

      <div className="flex flex-wrap justify-between items-start gap-4 mt-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-red-900">{habit.name}</h1>
          <p className="text-gray-600">{habit.description}</p>

          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-amber-100 text-red-900">
            {habit.category}
          </span>
        </div>

        <div className="flex gap-2">
          {isDoneToday ? (
            <button
              onClick={() => undoCheckIn.mutate({ habitId: id, dayKey: today })}
              disabled={undoCheckIn.isPending}
              className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 transition disabled:opacity-50"
            >
              Done Today
            </button>
          ) : (
            <button
              onClick={() => checkIn.mutate({ habitId: id, dayKey: today })}
              disabled={checkIn.isPending}
              className="px-4 py-2 rounded-lg bg-amber-800 text-amber-50 hover:bg-amber-600 transition disabled:opacity-50"
            >
              Check In Today
            </button>
          )}

          <button
            onClick={() => setShowDeleteDialog(true)}
            className="px-4 py-2 rounded-lg bg-red-100 text-red-900 hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Statistics for this one habit */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Current Streak" value={currentStreak} />
        <StatCard label="Best Streak" value={bestStreak} />
        <StatCard label="Last 30 Days" value={`${completionRate}%`} />
        <StatCard label="Total Check-ins" value={habit.completions.length} />
      </div>

      {/* Last 14 days */}
      <div className="bg-white rounded-2xl p-5">
        <h2 className="font-semibold text-red-900 mb-4">Last 14 Days</h2>

        <div className="flex flex-wrap gap-2">
          {recentDays.map((day) => (
            <div key={day.dayKey} className="flex flex-col items-center w-10">
              <div
                className={
                  day.isDone
                    ? "w-8 h-8 rounded-lg bg-amber-800"
                    : "w-8 h-8 rounded-lg bg-amber-100"
                }
                title={day.dayKey}
              ></div>

              <span className="text-xs text-gray-600 mt-1">
                {getWeekdayLabel(day.dayKey)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showDeleteDialog && (
        <ConfirmDialog
          message={`Delete "${habit.name}"? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
}

export default HabitDetails;
