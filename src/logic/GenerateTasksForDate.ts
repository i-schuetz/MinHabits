import { DayDate } from "../models/DayDate"
import { Habit } from "../models/Habit"
import { getHabitsForDate } from "./GetHabitsForDate";
import { Task } from "../models/helpers/Task";
import { associateBy } from "../utils/ArrayUtils";
import { TaskDoneStatus } from '../models/helpers/Task';
import { ResolvedTaskWithHabit } from "../models/join/ResolvedTaskWithHabit";
import * as TaskHelpers from "../models/helpers/Task";

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
 * This applies only to present or future because here have to generate the tasks using habits.
 * The only tasks that can be resolved already are those marked as done 
 * (a user can mark tasks as done today and even in the future).
 */
export function generateTasksForPresentOrFuture(date: DayDate, habits: Habit[], resolvedTasksForDate: ResolvedTaskWithHabit[]): Task[] {
  const habitsForDate: Habit[] = getHabitsForDate(date, habits)
  const tasksForHabits = habitsForDate.map((habit) => generateTaskForHabit(date, habit))
  return mergeTasksWithSameDate(tasksForHabits, resolvedTasksForDate)
}

/**
 * Generates tasks for a past date.
 */
export function generateTasksForPast(date: DayDate, resolvedTasksForDate: ResolvedTaskWithHabit[]): Task[] {
  return resolvedTasksForDate.map((resolvedTask) => generateTaskForResolvedTask(resolvedTask))
}

/**
 * Generates task for habit at given date.
 * Assumes that habit was already matched with date.
 * Also, for simplicity, there can be only one task per habit per date.
 */
function generateTaskForHabit(date: DayDate, habit: Habit): Task {
  return { 
    doneStatus: TaskDoneStatus.OPEN,
    date: date,
    habit: habit
  }
}

function generateTaskForResolvedTask(resolvedTask: ResolvedTaskWithHabit): Task {
  return {
    doneStatus: TaskHelpers.toDoneStatus(resolvedTask.task.done),
    date: resolvedTask.task.date,
    habit: resolvedTask.habit
  }
}

function mergeTasksWithSameDate(tasks: Task[], resolvedTasks: ResolvedTaskWithHabit[]): Task[] {
  const resolvedTasksByHabitId = associateBy((task) => task.task.habitId, resolvedTasks)
  return tasks.map((task) => {
    const resolvedTask = resolvedTasksByHabitId.get(task.habit.id)
    return { ...task, doneStatus: mapMaybeResolvedTaskToDoneStatus(resolvedTask) }
  })
}

function mapMaybeResolvedTaskToDoneStatus(resolvedTask: ResolvedTaskWithHabit | undefined): TaskDoneStatus {
  if (resolvedTask === undefined) {
    return TaskDoneStatus.OPEN
  }
  return TaskHelpers.toDoneStatus(resolvedTask.task.done)
}
