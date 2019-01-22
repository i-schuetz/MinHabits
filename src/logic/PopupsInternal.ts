import { ResolvedTask } from "../models/ResolvedTask"
import { Habit } from "../models/Habit"
import { groupHabitsByDonePercentageRange } from "./Stats"
import { WholePercentage } from "../models/helpers/WholePercentage";
import * as WholePercentageHelpers from "../models/helpers/WholePercentage";

export const retrieveUnfilteredNeedAttentionHabits = (habits: Habit[], resolvedTasks: ResolvedTask[]): Habit[] => {
  if (resolvedTasks.length == 0) {
    // If there are no resolved tasks (which means essentially that the habits are either open or not scheduled) nothing needs attention.
    console.log("No resolved tasks - nothing to do. Returning no habits.");
    return []
  }

  const threshold: WholePercentage = { digit1: 0, digit2: 2, digit3: 0 }
  const groupedByPercentage = groupHabitsByDonePercentageRange(
    [threshold],
    habits,
    resolvedTasks
  )
  if (groupedByPercentage.size == 0) {
    throw Error("Grouped by percentage should return at least one entry (100%)")
  }
  if (groupedByPercentage.size > 2) {
    throw Error("Expecting max. 2 entries (20% and 100%)")
  }

  return groupedByPercentage.get(WholePercentageHelpers.toNumber(threshold)) || []
}

export const filterNeedAttentionHabits = (habits: Habit[], habitIdsInWaitingList: number[]): Habit[] => {
  return habits.filter(
    habit => habitIdsInWaitingList.find(id => id === habit.id) === undefined
  ) 
}
