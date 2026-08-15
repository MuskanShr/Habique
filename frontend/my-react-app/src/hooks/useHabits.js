import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "./useAuthUser";
import * as habitsService from "../services/habits.service";

export function useHabits() {
  const user = useAuthUser();

  return useQuery({
    queryKey: ["habits", user?.id],
    queryFn: () => habitsService.getHabits(user.id),
    enabled: !!user,
  });
}

export function useHabit(habitId) {
  const user = useAuthUser();

  return useQuery({
    queryKey: ["habits", user?.id, habitId],
    queryFn: () => habitsService.getHabitById(user.id, habitId),
    enabled: !!user,
  });
}

// adds a habit.
export function useCreateHabit() {
  const user = useAuthUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHabit) => habitsService.createHabit(user.id, newHabit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// updates a habit.
export function useUpdateHabit() {
  const user = useAuthUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, changes }) =>
      habitsService.updateHabit(user.id, habitId, changes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// deletes a habit.
export function useDeleteHabit() {
  const user = useAuthUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habitId) => habitsService.deleteHabit(user.id, habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// checks in a habit for one day.
export function useCheckIn() {
  const user = useAuthUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, dayKey }) =>
      habitsService.checkInHabit(user.id, habitId, dayKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// undoes a check-in for one day.
export function useUndoCheckIn() {
  const user = useAuthUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ habitId, dayKey }) =>
      habitsService.undoCheckInHabit(user.id, habitId, dayKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}
