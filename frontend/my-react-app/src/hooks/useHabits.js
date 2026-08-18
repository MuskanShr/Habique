import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "./useAuthUser";
import * as habitsService from "../services/habits.service";

export function useHabits() {
  const user = useAuthUser();

  return useQuery({
    queryKey: ["habits", user?.id],
    queryFn: () => habitsService.getHabits(),
    enabled: !!user,
  });
}

// This hook gets ONE habit by its id.
export function useHabit(habitId) {
  const user = useAuthUser();

  return useQuery({
    queryKey: ["habits", user?.id, habitId],
    queryFn: () => habitsService.getHabitById(habitId),
    enabled: !!user,
  });
}

// This hook adds a habit.
export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHabit) => habitsService.createHabit(newHabit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// This hook updates a habit.
export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, changes }) =>
      habitsService.updateHabit(habitId, changes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// This hook deletes a habit.
export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habitId) => habitsService.deleteHabit(habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// This hook checks in a habit for one day.
export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, dayKey }) =>
      habitsService.checkInHabit(habitId, dayKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// This hook undoes a check-in for one day.
export function useUndoCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, dayKey }) =>
      habitsService.undoCheckInHabit(habitId, dayKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}
