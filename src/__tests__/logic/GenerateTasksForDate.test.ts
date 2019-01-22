import { Month } from "../../models/Month"
import { TaskDoneStatus } from "../../models/helpers/Task"
import { wakeUpWeekdaysHabit, meditateHabit, sendPreliminaryTaxes } from "../../__tests_deps/ExampleHabits"
import { generateTasksForResolvedDate, generateTasksForOpenDate } from "../../logic/GenerateTasksForDate"

describe("Generates tasks for resolved date", () => {
  it("Determine resolve tasks action", () => {
    // One resolved task with done: false -> one missed task
    expect(
      generateTasksForResolvedDate({ day: 1, month: Month.December, year: 2020 }, [
        {
          task: { id: 0, habitId: meditateHabit.id, done: false, date: { day: 1, month: Month.December, year: 2020 } },
          habit: meditateHabit
        }
      ])
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.MISSED,
        date: { day: 1, month: Month.December, year: 2020 },
        habit: meditateHabit
      }
    ])

    // One resolved task with done: true -> one done task
    expect(
      generateTasksForResolvedDate({ day: 1, month: Month.December, year: 2020 }, [
        {
          task: { id: 0, habitId: meditateHabit.id, done: true, date: { day: 1, month: Month.December, year: 2020 } },
          habit: meditateHabit
        }
      ])
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 1, month: Month.December, year: 2020 },
        habit: meditateHabit
      }
    ])

    // No resolved tasks -> no tasks
    expect(generateTasksForResolvedDate({ day: 1, month: Month.December, year: 2020 }, [])).toEqual([])

    // Miscellaneous
    expect(
      generateTasksForResolvedDate({ day: 1, month: Month.December, year: 2020 }, [
        {
          task: { id: 0, habitId: meditateHabit.id, done: true, date: { day: 1, month: Month.December, year: 2020 } },
          habit: meditateHabit
        },
        {
          task: {
            id: 1,
            habitId: wakeUpWeekdaysHabit.id,
            done: false,
            date: { day: 12, month: Month.February, year: 2000 }
          },
          habit: wakeUpWeekdaysHabit
        },
        {
          task: {
            id: 2,
            habitId: sendPreliminaryTaxes.id,
            done: true,
            date: { day: 1, month: Month.January, year: 2020 }
          },
          habit: sendPreliminaryTaxes
        }
      ])
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 1, month: Month.December, year: 2020 },
        habit: meditateHabit
      },
      {
        doneStatus: TaskDoneStatus.MISSED,
        date: { day: 12, month: Month.February, year: 2000 },
        habit: wakeUpWeekdaysHabit
      },

      {
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 1, month: Month.January, year: 2020 },
        habit: sendPreliminaryTaxes
      }
    ])
  })

  it("Generates tasks for open date", () => {
    // Habit was resolved for the date
    expect(
      generateTasksForOpenDate(
        { day: 1, month: Month.December, year: 2020 },
        [meditateHabit],
        [
          {
            task: {
              id: 0,
              habitId: meditateHabit.id,
              done: true,
              date: { day: 1, month: Month.December, year: 2020 }
            },
            habit: meditateHabit
          }
        ]
      )
    ).toEqual([
      {
        // First habit was done, because there was a (done) resolved task for it
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 1, month: Month.December, year: 2020 },
        habit: meditateHabit
      }
    ])

    // One habit was resolved for the date, but not the other
    expect(
      generateTasksForOpenDate(
        { day: 1, month: Month.December, year: 2020 },
        [meditateHabit, wakeUpWeekdaysHabit],
        [
          {
            task: {
              id: 0,
              habitId: meditateHabit.id,
              done: true,
              date: { day: 1, month: Month.December, year: 2020 }
            },
            habit: meditateHabit
          }
        ]
      )
    ).toEqual([
      {
        // First habit was done, because there was a (done) resolved task for it
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 1, month: Month.December, year: 2020 },
        habit: meditateHabit
      },
      {
        // Second habit is OPEN, because there was no resolved task for it and the date is open.
        doneStatus: TaskDoneStatus.OPEN,
        date: { day: 1, month: Month.December, year: 2020 },
        habit: wakeUpWeekdaysHabit
      }
    ])

    // One habit was missed for the date.
    // This is not a real scenario as if there's a resolved MISSED (done: false) task, it means that
    // the date was resolved already, so this method will not be called.
    // But anyway - done: false is correctly mapped to MISSED.
    // "open date" affects only the case where there's no resolved task for an habit, in which case the generated
    // task will have status OPEN instead of MISSED.
    expect(
      generateTasksForOpenDate(
        { day: 1, month: Month.December, year: 2020 },
        [meditateHabit],
        [
          {
            task: {
              id: 0,
              habitId: meditateHabit.id,
              done: false,
              date: { day: 1, month: Month.December, year: 2020 }
            },
            habit: meditateHabit
          }
        ]
      )
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.MISSED,
        date: { day: 1, month: Month.December, year: 2020 },
        habit: meditateHabit
      }
    ])

    // No habits and resolved tasks passed - no tasks generated
    expect(generateTasksForOpenDate({ day: 1, month: Month.December, year: 2020 }, [], [])).toEqual([])

    // No habits passed, but a resolved task - no tasks generated
    // This means that the user deleted the habit from which the resolved task was generated.
    // Which means that the user also doesn't want to see tasks for it.
    // There's no use case where we want to generate actual tasks from resolved tasks without habits.
    // Note: This is not a real scenario, as resolved tasks have a foreign key to habits,
    // (TODO cascade delete)
    // so deleting an habit will automatically delete the resolved task.
    expect(
      generateTasksForOpenDate(
        { day: 1, month: Month.December, year: 2020 },
        [],
        [
          {
            task: {
              id: 0,
              habitId: meditateHabit.id,
              done: true,
              date: { day: 1, month: Month.December, year: 2020 }
            },
            habit: meditateHabit
          }
        ]
      )
    ).toEqual([])
  })
})
