import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "./useAuthUser";
import * as habitsService from "../services/habits.service";

// React Query in four ideas:
//
// queryKey  - the name the data is stored under in the cache: ["habits"]
// queryFn   - the async function that actually gets the data
// isLoading / isError - flags we use to show a spinner or an error
// invalidateQueries - "the data changed, fetch it again"

// This hook gets the habits list.
export function useHabits() {
  const user = useAuthUser();

  return useQuery({
    queryKey: ["habits", user?.id],
    queryFn: () => habitsService.getHabits(user.id),
    // Do not run until we know who the user is.
    enabled: !!user,
  });
}

// This hook adds a habit.
export function useCreateHabit() {
  const user = useAuthUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newHabit) => habitsService.createHabit(user.id, newHabit),
    onSuccess: () => {
      // The list is now out of date, so tell React Query to refetch it.
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// This hook checks in a habit for one day.
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

// This hook undoes a check-in for one day.
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
