import { DayDate } from "../models/DayDate"
import { Habit } from "../models/Habit"
import { getHabitsForDate } from "./GetHabitsForDate";
import { Task } from "../models/helpers/Task";
import { ResolvedTaskWithHabit } from "../models/join/ResolvedTaskWithHabit";
import { generateTaskForHabit, mergeTasksWithSameOpenDate, generateTaskForResolvedTask } from "./GenerateTasksForDateInternal";

// TODO unit tests
// TODO add unique to DB for task (habitId, date)

/**
 * Generates complete list of tasks to show for a given date, based on scheduled habits and resolved tasks.
 * Specifically:
 * 1. Retrieves habits for date (time rule match)
 * 2. Converts these habits to tasks
 * 3. Updates tasks with done status of resolved tasks where there are resolved tasks. If a task hasn't been resolved
 * yet (i.e. it doesn't have a corresponding resolved task), its status will be OPEN.
 * 
 * @param date date for which tasks have to be determined.
 * @param habits all habits. Used to generate tasks.
 * @param resolvedTasksForDate already resolved tasks for date.
 * 
 * NOTE: Open date means that its tasks haven't been resolved yet. This date can be in the past, present or future.
 * 
 * IMPORTANT: The date of all the resolved tasks is assumed to be equal to @param date.
 * TODO can we make this safer? either ensure somehow the tasks really have the same date or handle case where they don't, or general refactoring/review of why this is needed.
 */
export function generateTasksForOpenDate(date: DayDate, habits: Habit[], resolvedTasksForDate: ResolvedTaskWithHabit[]): Task[] {
  const habitsForDate: Habit[] = getHabitsForDate(date, habits)
  const tasksForHabits = habitsForDate.map((habit) => generateTaskForHabit(date, habit))
  return mergeTasksWithSameOpenDate(tasksForHabits, resolvedTasksForDate)
}

/**
 * Generates tasks for a resolved date (i.e. where all tasks were marked as done/not done)
 * TODO date parameter not used?
 */
export function generateTasksForResolvedDate(date: DayDate, resolvedTasksForDate: ResolvedTaskWithHabit[]): Task[] {
  return resolvedTasksForDate.map((resolvedTask) => generateTaskForResolvedTask(resolvedTask))
}
