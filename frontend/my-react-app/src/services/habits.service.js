import { apiRequest } from "./api";

export async function getHabits() {
  const result = await apiRequest("/habits");
  return result.data;
}

export async function getHabitById(habitId) {
  const result = await apiRequest(`/habits/${habitId}`);
  return result.data;
}

export async function createHabit(newHabit) {
  const result = await apiRequest("/habits", {
    method: "POST",
    body: {
      name: newHabit.name,
      description: newHabit.description,
      category: newHabit.category,
    },
  });

  return result.data;
}

// updates a habit.
export async function updateHabit(habitId, changes) {
  const result = await apiRequest(`/habits/${habitId}`, {
    method: "PUT",
    body: {
      name: changes.name,
      description: changes.description,
      category: changes.category,
    },
  });

  return result.data;
}

// deletes a habit.
export async function deleteHabit(habitId) {
  const result = await apiRequest(`/habits/${habitId}`, {
    method: "DELETE",
  });

  return result;
}

export async function checkInHabit(habitId, dayKey) {
  const result = await apiRequest(`/habits/${habitId}/checkin`, {
    method: "POST",
    body: { dayKey: dayKey },
  });

  return result.data;
}

export async function undoCheckInHabit(habitId, dayKey) {
  const result = await apiRequest(`/habits/${habitId}/undo-checkin`, {
    method: "POST",
    body: { dayKey: dayKey },
  });

  return result.data;
}
