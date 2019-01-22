import { ResolvedTask } from "../models/ResolvedTask"
import { Habit } from "../models/Habit"
import { filterNeedAttentionHabits, retrieveUnfilteredNeedAttentionHabits } from "./PopupsInternal"
import { getDonePercentage } from "./Stats"

// TODO unit tests

export const showHabitNeedsAttentionPopup = async (
  loadHabitsInWaitingList: () => Promise<number[]>,
  resolvedTasksInLastWeek: ResolvedTask[],
  habits: Habit[]
): Promise<NeedsAttentionPopupAction> => {
  const unfilteredNeedAttentionHabits = retrieveUnfilteredNeedAttentionHabits(habits, resolvedTasksInLastWeek)
  if (unfilteredNeedAttentionHabits.length == 0) {
    console.log("No habit needs attention popup - No habits under 20%")
    return { kind: "none" }
  }

  const needAttentionHabits = filterNeedAttentionHabits(unfilteredNeedAttentionHabits, await loadHabitsInWaitingList())
  if (needAttentionHabits.length == 0) {
    console.log("No habit needs attention popup - All habits that need attention are in waiting list.")
    return { kind: "none" }
  } else {
    return { kind: "show", habits: needAttentionHabits }
  }
}

export function showCongratulationsPopup(resolvedTasksInLastWeek: ResolvedTask[]): CongratulationsPopupAction {
  // Check whether user has completed a week with 100% on a non empty task list.
  if (getDonePercentage(resolvedTasksInLastWeek) == { digit1: 1, digit2: 0, digit3: 0 }) {
    return CongratulationsPopupAction.SHOW_WEEKLY 
  } else {
    return CongratulationsPopupAction.NONE 
  }
}

export type NeedsAttentionPopupAction = NeedsAttentionPopupActionShow | NeedsAttentionPopupActionNone

export interface NeedsAttentionPopupActionShow {
  kind: "show"
  habits: Habit[]
}

export interface NeedsAttentionPopupActionNone {
  kind: "none"
}

export enum CongratulationsPopupAction {
  SHOW_WEEKLY,
  NONE
}
