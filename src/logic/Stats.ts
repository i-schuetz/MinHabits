import { ResolvedTask } from "../models/ResolvedTask"
import { MonthPercentage } from "../models/helpers/MonthPercentage"
import { WholePercentage } from "../models/helpers/WholePercentage"
import * as WholePercentageHelpers from "../models/helpers/WholePercentage"
import { groupBy, associateBy } from "../utils/ArrayUtils"
import { Habit } from "../models/Habit"

/**
 * @returns done percentage of tasks. 0% if tasks is empty.
 */
export function getDonePercentage(tasks: ResolvedTask[]): WholePercentage {
  if (tasks.length == 0) {
    // If there are no tasks, we have done nothing.
    // This may be counter intuitive. If there are no tasks we rather should say we did everything.
    // But the current purpose of this method is presentation and it sounds better to tell the users that they have done nothing yet.
    // If more purposes are added, we agree on 0% as convention anyway.
    return { digit1: 0, digit2: 0, digit3: 0 }
  }
  const doneCount = tasks.filter(task => task.done).length
  const percentage = doneCount / tasks.length
  return WholePercentageHelpers.toWholePercentage(percentage)
}

export function getDoneMonthlyPercentage(tasks: ResolvedTask[]): MonthPercentage[] {
  const groupedTasks = groupBy(task => task.date.month, tasks)
  return Array.from(groupedTasks.entries()).map(entry => ({ month: entry[0], percentage: getDonePercentage(entry[1]) }))
}

/**
 * Maps percentages to array of habits which have been done less or equal than each percentage.
 * 
 * @param ranges
 * @param habits complete habits list, used to retrieve habits referenced by resolved tasks. 
 * @param tasks resolved tasks used to generate the tasks.
 * @returns Map with percentage (0..100) -> habits.
 * If there are tasks percentages that don't fall under the passed ranges, they are grouped under a new 100% key.
 * Consequently with above, if no ranges are passed, all the tasks are grouped under a 100% key.
 * returning number keys instead of WholePercentage because don't know how to make the later "hashable".
 */
export function groupHabitsByDonePercentageRange(
  ranges: WholePercentage[],
  habits: Habit[],
  tasks: ResolvedTask[]
): Map<number, Habit[]> {
  const tasksGroupedByHabit = groupBy(task => task.habitId, tasks)
  const habitsMap = associateBy(habit => habit.id, habits)

  return Array.from(tasksGroupedByHabit.entries()).reduce((rv: Map<number, Habit[]>, entry: any) => {
    const habitId: number = entry[0]

    const habit: Habit | undefined = habitsMap.get(habitId)
    if (habit === undefined) {
      // The habits array are assumed to be all existent habits, and tasks has a foreign key to habits so this is invalid state.
      throw Error("Task habit id was not found in habits map")
    }

    // Calculate done percentage
    const tasks: ResolvedTask[] = entry[1]
    const percentage: WholePercentage = getDonePercentage(tasks)
    const numberPercentage = WholePercentageHelpers.toNumber(percentage)

    // Find range to which done percentage belongs
    var percentageUpperBoundMaybe: WholePercentage | undefined = ranges.find(
      rangePercentage => numberPercentage <= WholePercentageHelpers.toNumber(rangePercentage)
    )
    const percentageUpperBound: WholePercentage =
      percentageUpperBoundMaybe === undefined ? { digit1: 1, digit2: 0, digit3: 0 } : percentageUpperBoundMaybe

    // Add to values
    const mapKey = WholePercentageHelpers.toNumber(percentageUpperBound)
    var habits: Habit[] | undefined = rv.get(mapKey)
    if (habits === undefined) {
      habits = []
    }
    habits.push(habit)
    rv.set(mapKey, habits)
    return rv
  }, new Map())
}
