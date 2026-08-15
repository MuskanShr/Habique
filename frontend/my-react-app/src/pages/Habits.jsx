import { useState } from "react";
import {
  useHabits,
  useCreateHabit,
  useUpdateHabit,
  useDeleteHabit,
  useCheckIn,
  useUndoCheckIn,
} from "../hooks/useHabits";
import { getTodayKey } from "../lib/date";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import Spinner from "../components/Spinner";

function Habits() {
  const today = getTodayKey();

  const { data: habits, isLoading, isError } = useHabits();

  const createHabit = useCreateHabit();
  const updateHabit = useUpdateHabit();
  const deleteHabit = useDeleteHabit();
  const checkIn = useCheckIn();
  const undoCheckIn = useUndoCheckIn();

  const [showForm, setShowForm] = useState(false);

  const [editingHabit, setEditingHabit] = useState(null);

  const [habitToDelete, setHabitToDelete] = useState(null);

  // opens the form for a NEW habit.
  const handleOpenAddForm = () => {
    setEditingHabit(null);
    setShowForm(true);
  };

  // opens the form for an EXISTING habit.
  const handleOpenEditForm = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  // closes the form.
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  // saves the form, either adding or updating.
  const handleSave = (values) => {
    if (editingHabit) {
      updateHabit.mutate({
        habitId: editingHabit._id,
        changes: values,
      });
    } else {
      createHabit.mutate(values);
    }

    handleCloseForm();
  };

  // deletes the habit the user confirmed.
  const handleConfirmDelete = () => {
    deleteHabit.mutate(habitToDelete._id);
    setHabitToDelete(null);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <p className="text-red-800">Could not load your habits.</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-900">My Habits</h1>

        {!showForm && (
          <button
            onClick={handleOpenAddForm}
            className="px-5 py-3 rounded-lg bg-amber-800 text-amber-50 hover:bg-amber-600 transition"
          >
            + Add Habit
          </button>
        )}
      </div>

      {showForm && (
        <HabitForm
          // The key forces React to build a FRESH form when we switch
          // between adding and editing, so the boxes fill correctly.
          key={editingHabit ? editingHabit._id : "new"}
          habit={editingHabit}
          onSubmit={handleSave}
          onCancel={handleCloseForm}
          isBusy={createHabit.isPending || updateHabit.isPending}
          submitLabel={editingHabit ? "Save Changes" : "Add Habit"}
        />
      )}

      {habits.length === 0 ? (
        <EmptyState message="You have no habits yet. Click Add Habit to create your first one." />
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
              onEdit={() => handleOpenEditForm(habit)}
              onDelete={() => setHabitToDelete(habit)}
            />
          ))}
        </div>
      )}

      {habitToDelete && (
        <ConfirmDialog
          message={`Delete "${habitToDelete.name}"? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setHabitToDelete(null)}
        />
      )}
    </div>
  );
}

export default Habits;
