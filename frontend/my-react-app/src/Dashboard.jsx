import { useState } from "react";
import useAuthUser from "./hooks/useAuthUser";
import {
  useHabits,
  useCreateHabit,
  useCheckIn,
  useUndoCheckIn,
} from "./hooks/useHabits";
import { getTodayKey, getTodayLabel } from "./lib/date";
import {
  getWeeklyProgress,
  getBestCurrentStreak,
  getBestOverallStreak,
} from "./lib/streaks";
import StatCard from "./components/StatCard";
import HabitCard from "./components/HabitCard";
import EmptyState from "./components/EmptyState";
import Spinner from "./components/Spinner";
import ProgressBar from "./components/ProgressBar";
import WeeklyProgress from "./components/WeeklyProgress";

function Dashboard() {
  const user = useAuthUser();
  const today = getTodayKey();

  // Get the habits from React Query.
  const { data: habits, isLoading, isError } = useHabits();

  const createHabit = useCreateHabit();
  const checkIn = useCheckIn();
  const undoCheckIn = useUndoCheckIn();

  const [newHabitName, setNewHabitName] = useState("");

  // This function adds a habit from the quick-add box.
  const handleQuickAdd = (e) => {
    e.preventDefault();

    if (!newHabitName.trim()) {
      alert("Please enter a habit name.");
      return;
    }

    createHabit.mutate({
      name: newHabitName,
      description: "",
      category: "General",
    });

    setNewHabitName("");
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <p className="text-red-800">Could not load your habits.</p>;
  }

  // Count how many habits are already checked in today.
  const completedToday = habits.filter((h) =>
    h.completions.includes(today),
  ).length;

  const totalHabits = habits.length;

  // Work out the percentage, avoiding division by zero.
  let completionPercent = 0;
  if (totalHabits > 0) {
    completionPercent = Math.round((completedToday / totalHabits) * 100);
  }

  // Streak numbers, calculated from the completions arrays.
  const currentStreak = getBestCurrentStreak(habits);
  const bestStreak = getBestOverallStreak(habits);

  // The last 7 days of progress.
  const week = getWeeklyProgress(habits);

  return (
    <div>
      <h1 className="text-3xl font-bold text-red-900">
        Welcome back, {user ? user.name : "there"}!
      </h1>
      <p className="text-gray-600 mb-6">{getTodayLabel()}</p>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Habits" value={totalHabits} />
        <StatCard label="Completed Today" value={completedToday} />
        <StatCard label="Current Streak" value={currentStreak} />
        <StatCard label="Best Streak" value={bestStreak} />
      </div>

      {/* Today's progress */}
      <div className="bg-white rounded-2xl p-5 mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-semibold text-red-900">Today's Progress</span>
          <span className="text-red-900">{completionPercent}%</span>
        </div>

        <ProgressBar percent={completionPercent} />
      </div>

      {/* Weekly progress */}
      <WeeklyProgress week={week} />

      {/* Quick add */}
      <form onSubmit={handleQuickAdd} className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded-lg px-4 py-3"
          type="text"
          placeholder="Quick add a habit..."
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <button
          type="submit"
          disabled={createHabit.isPending}
          className="px-5 py-3 rounded-lg bg-amber-800 text-amber-50 hover:bg-amber-600 transition disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {/* Today's habits */}
      <h2 className="text-xl font-semibold text-red-900 mb-3">
        Today's Habits
      </h2>

      {totalHabits === 0 ? (
        <EmptyState message="You have no habits yet. Add your first habit above!" />
      ) : (
        <div className="flex flex-col gap-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              isDoneToday={habit.completions.includes(today)}
              isBusy={checkIn.isPending || undoCheckIn.isPending}
              onCheckIn={() =>
                checkIn.mutate({ habitId: habit._id, dayKey: today })
              }
              onUndo={() =>
                undoCheckIn.mutate({ habitId: habit._id, dayKey: today })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
