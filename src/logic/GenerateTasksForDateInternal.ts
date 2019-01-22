import { DayDate } from "../models/DayDate"
import { Habit } from "../models/Habit"
import { getHabitsForDate } from "./GetHabitsForDate";
import { Task } from "../models/helpers/Task";
import { associateBy } from "../utils/ArrayUtils";
import { TaskDoneStatus } from '../models/helpers/Task';
import { ResolvedTaskWithHabit } from "../models/join/ResolvedTaskWithHabit";
import * as TaskHelpers from "../models/helpers/Task";

/**
 * Generates task for habit at given date.
 * Assumes that habit was already matched with date.
 * Also, for simplicity, there can be only one task per habit per date.
 */
export function generateTaskForHabit(date: DayDate, habit: Habit): Task {
  return { 
    doneStatus: TaskDoneStatus.OPEN,
    date: date,
    habit: habit
  }
}

export function generateTaskForResolvedTask(resolvedTask: ResolvedTaskWithHabit): Task {
  return {
    doneStatus: TaskHelpers.toDoneStatus(resolvedTask.task.done),
    date: resolvedTask.task.date,
    habit: resolvedTask.habit
  }
}

/**
 * Updates tasks with done status of resolved task. If no resolved task can be found for a task, the done status of the task is OPEN.
 * The matching is done with the habit id.
 * This method assumes that the tasks and resolved tasks have the same date.
 * 
 * @param tasks tasks to be updated.
 * @param resolvedTasks used to update task with their done status.
 * 
 * IMPORTANT: Everything (Tasks and resolved tasks) must have the same date!
 * TODO can we make this safer? either ensure somehow the tasks really have the same date or handle case where they don't, or general refactoring/review of why this is needed.
 */
export function mergeTasksWithSameOpenDate(tasks: Task[], resolvedTasks: ResolvedTaskWithHabit[]): Task[] {
  const resolvedTasksByHabitId = associateBy((resolvedTask) => resolvedTask.task.habitId, resolvedTasks)
  return tasks.map((task) => {
    const resolvedTask = resolvedTasksByHabitId.get(task.habit.id)
    return { ...task, doneStatus: mapMaybeResolvedTaskToDoneStatusForOpenDate(resolvedTask) }
  })
}

/**
 * NOTE: Only for open dates (present or future) - undefined resolved tasks maps to OPEN status.
 */
export function mapMaybeResolvedTaskToDoneStatusForOpenDate(resolvedTask: ResolvedTaskWithHabit | undefined): TaskDoneStatus {
  if (resolvedTask === undefined) {
    return TaskDoneStatus.OPEN
  }
  return TaskHelpers.toDoneStatus(resolvedTask.task.done)
}
