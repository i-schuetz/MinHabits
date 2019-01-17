import { Month } from "../../models/Month"
import * as Stats from "../../logic/Stats"
import { tasks, tasksWithManyFailed } from "./ExampleTasks"
import { habits, wakeUpWeekdaysHabit, makeSportHabit, meditateHabit } from "./ExampleHabits"

describe("Stats", () => {
  it("Calculate total percentage", () => {
    expect(Stats.getDonePercentage(tasks)).toEqual({ digit1: 0, digit2: 7, digit3: 5 })
    
    // No tasks, it means the user did nothing(0%) (see explanation in getDonePercentage)
    expect(Stats.getDonePercentage([])).toEqual({ digit1: 0, digit2: 0, digit3: 0 })
  })

  it("Calculate monthly percentage", () => {
    expect(Stats.getDoneMonthlyPercentage(tasks)).toEqual([
      { month: Month.January, percentage: { digit1: 0, digit2: 8, digit3: 3 } },
      { month: Month.February, percentage: { digit1: 0, digit2: 3, digit3: 3 } },
      { month: Month.March, percentage: { digit1: 1, digit2: 0, digit3: 0 } }
    ])
 
    // No tasks - empty months result
    expect(Stats.getDoneMonthlyPercentage([])).toEqual([])
  })

  it("Group habits by done percentage", () => {
    expect(
      Stats.groupHabitsByDonePercentageRange(
        [{ digit1: 0, digit2: 5, digit3: 0 }, { digit1: 1, digit2: 0, digit3: 0 }],
        habits,
        tasks
      )
    ).toEqual(new Map([[100, [wakeUpWeekdaysHabit, makeSportHabit, meditateHabit]]]))

    expect(
      Stats.groupHabitsByDonePercentageRange(
        [{ digit1: 0, digit2: 5, digit3: 0 }, { digit1: 1, digit2: 0, digit3: 0 }],
        habits,
        tasksWithManyFailed
      )
    ).toEqual(new Map([[50, [makeSportHabit, meditateHabit]], [100, [wakeUpWeekdaysHabit]]]))

    // No tasks - user did nothing
    // Note: Map is empty, as keys are generated lazily for values. If there are no values, there are no keys.
    // Note: Schedule of habits is ignored! The tasks are the only source of truth for done/not done
    // We rely on the habits being converted to tasks at the end of the day. The habit's schedule is used only
    // to generate the tasks for the day.
    expect(
      Stats.groupHabitsByDonePercentageRange(
        [{ digit1: 0, digit2: 5, digit3: 0 }, { digit1: 1, digit2: 0, digit3: 0 }],
        habits,
        []
      )
    ).toEqual(new Map([]))

    // Non-empty tasks but no habits: Invalid state!
    // Each task references an habit (via foreign key in the db) and all the habits has to be passed.
    // So there must be at least one habit.
    expect(() =>
      Stats.groupHabitsByDonePercentageRange(
        [{ digit1: 0, digit2: 5, digit3: 0 }, { digit1: 1, digit2: 0, digit3: 0 }],
        [],
        tasks
      )
    ).toThrow()

    // No tasks and no habits - user did nothing.
    // Note: Map is empty, as keys are generated lazily for values. If there are no values, there are no keys.
    expect(
      Stats.groupHabitsByDonePercentageRange(
        [{ digit1: 0, digit2: 5, digit3: 0 }, { digit1: 1, digit2: 0, digit3: 0 }],
        [],
        []
      )
    ).toEqual(new Map([])) 

    // No ranges passed - all the task's habits are returned under 100%
    expect(
      Stats.groupHabitsByDonePercentageRange(
        [],
        habits,
        tasksWithManyFailed
      )
      ).toEqual(new Map([[100, [wakeUpWeekdaysHabit, makeSportHabit, meditateHabit]]]))
    })
})
