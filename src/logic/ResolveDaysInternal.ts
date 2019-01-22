import { DayDate } from "../models/DayDate"
import * as DateUtils from "../utils/DateUtils"
import * as DayDateHelpers from "../models/DayDate"
import { Order } from "../models/helpers/Order"
import { generateTasksForOpenDate } from "./GenerateTasksForDate"
import { Task, TaskDoneStatus } from "../models/helpers/Task"
import { ResolvedTaskInput } from "../models/helpers/ResolvedTaskInput"
import { Habit } from "../models/Habit"
import { ResolvedTaskWithHabit } from "../models/join/ResolvedTaskWithHabit"
import { groupBy } from "../utils/ArrayUtils";

// This file is meant to be used only by ResolveDays and unit tests.

export const resolveUnresolvedDaysDeps = async (
  resolvedIntervalEndDate: DayDate,
  generateTasksForUnresolvedDays: (lastResolvedDate: DayDate) => Promise<Task[]>,
  loadLastResolvedDateString: () => Promise<string | null>,
  loadHabits: () => Promise<Habit[]>,
  saveLastResolvedDate: (dayDate: DayDate) => void,
  persistResolvedTasks: (tasks: Task[]) => Promise<void>
) => {
  const intervalStartDate: ResolvedIntervalStartDateResult = await determineIntervalStartDate(
    loadLastResolvedDateString,
    loadHabits
  )

  if (intervalStartDate.kind === "none") {
    console.log("Nothing to resolve.")
    return
  }

  const resolveTasksAction = determineResolveTasksAction(intervalStartDate.date, resolvedIntervalEndDate)
  const tasks: Task[] = await toTasks(generateTasksForUnresolvedDays, resolveTasksAction, intervalStartDate.date)

  const missedTasks = filterMissedTasks(tasks)

  await persistResolvedTasks(missedTasks)
  saveLastResolvedDate(resolvedIntervalEndDate)

  console.log("Resolved days until yesterday.")
}

export const toTasks = async (
  generateTasksForUnresolvedDays: (intervalStartDate: DayDate) => Promise<Task[]>,
  resolveAction: ResolveTasksAction,
  intervalStartDate: DayDate
) => {
  switch (resolveAction) {
    case ResolveTasksAction.RESOLVE:
      return await generateTasksForUnresolvedDays(intervalStartDate)
    case ResolveTasksAction.NONE:
      return []
  }
}

export const generateTasksForUnresolvedDays = (
  resolvedIntervalEndDate: DayDate,
  loadResolvedTasks: (intervalStartDate: DayDate) => Promise<ResolvedTaskWithHabit[]>,
  loadHabits: () => Promise<Habit[]>
) => async (intervalStartDate: DayDate): Promise<Task[]> => {
  const resolvedTasks = await loadResolvedTasks(intervalStartDate)
  const habits = await loadHabits()
  return generateTasksSinceLastResolvedDate(intervalStartDate, resolvedIntervalEndDate, habits, resolvedTasks)
}

/**
 * Determines the start date of interval to resolve tasks.
 * @returns If there's a last resolved date stored (meaning tasks were resolved at least once already), this date will be returned.
 * Otherwise (tasks have never been resolved yet) it returns the earliest habits start date.
 * If there are no habits stored either, it returns "none", which means that there's no interval / nothing to resolve.
 */
export const determineIntervalStartDate = async (
  loadLastResolvedDateString: () => Promise<string | null>,
  loadHabits: () => Promise<Habit[]>
): Promise<ResolvedIntervalStartDateResult> => {
  const lastResolvedDateString = await loadLastResolvedDateString()
  if (lastResolvedDateString !== null) {
    return { kind: "date", date: DayDateHelpers.parse(lastResolvedDateString) }
  } else {
    const habits = await loadHabits()
    if (habits.length == 0) {
      console.log("No habits.");
      return { kind: "none" }
    } else {
      const anyHabit = habits[0]
      const earliestHabitStartDate = habits.reduce(
        (rv, habit) => (DayDateHelpers.compare(habit.time.start, rv) == Order.LT ? habit.time.start : rv),
        anyHabit.time.start
      )
      return { kind: "date", date: earliestHabitStartDate }
    }
  }
}

//////////////////
// Pure //////////
//////////////////

export function generateTasksSinceLastResolvedDate(
  lastResolvedDate: DayDate,
  resolvedIntervalEndDate: DayDate,
  habits: Habit[],
  resolvedTasks: ResolvedTaskWithHabit[]
): Task[] {
  const dates = DateUtils.generateDateRange(lastResolvedDate, resolvedIntervalEndDate)
  const resolvedTasksByDate = groupBy((resolvedTask) => DayDateHelpers.toJSON(resolvedTask.task.date), resolvedTasks)
  const tasks = dates.map(date => generateTasksForOpenDate(date, habits, resolvedTasksByDate.get(DayDateHelpers.toJSON(date)) || []))
  return ([] as Task[]).concat(...tasks) // Flatten
}

export function filterMissedTasks(tasks: Task[]) {
  // Strictly, we could query here == TaskDoneStatus.OPEN - as since the days have not been resolved,
  // their tasks can't be marked as missed. But going the more generous approach. If we allow users in the future
  // to mark tasks as missed themselves (e.g. by "skipping" it beforehand), this logic will still work.
  return tasks.filter(task => task.doneStatus != TaskDoneStatus.DONE)
}

export function toResolvedTaskInput(task: Task): ResolvedTaskInput {
  return {
    habitId: task.habit.id,
    done: task.doneStatus === TaskDoneStatus.DONE,
    date: task.date
  }
}

export const determineResolveTasksAction = (lastResolvedDate: DayDate, resolvedIntervalEndDate: DayDate) => {
  switch (DayDateHelpers.compare(lastResolvedDate, resolvedIntervalEndDate)) {
    case Order.LT:
      return ResolveTasksAction.RESOLVE
    case Order.EQ:
      // The last resolved date was yesterday - nothing to do.
      return ResolveTasksAction.NONE
    case Order.GT:
      // Dates are always resolved for the past, so there can't be a lastResolvedDate today or in the future.
      throw Error(
        `Invalid state: lastResolvedDate (${JSON.stringify(
          lastResolvedDate
        )}) can't be more recent than yesterday (${JSON.stringify(resolvedIntervalEndDate)})`
      )
  }
}

export enum ResolveTasksAction {
  RESOLVE,
  NONE
}

export type ResolvedIntervalStartDateResult =
  | ResolvedIntervalStartDateResultNone
  | ResolvedIntervalStartDateResultStartDate

export interface ResolvedIntervalStartDateResultNone {
  kind: "none"
}

export interface ResolvedIntervalStartDateResultStartDate {
  kind: "date"
  date: DayDate
}
