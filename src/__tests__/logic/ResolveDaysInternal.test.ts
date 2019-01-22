import { Month } from "../../models/Month"
import {
  determineResolveTasksAction,
  ResolveTasksAction,
  toResolvedTaskInput,
  filterMissedTasks,
  toTasks,
  resolveUnresolvedDaysDeps
} from "../../logic/ResolveDaysInternal"
import { TaskDoneStatus, Task } from "../../models/helpers/Task"
import { wakeUpWeekdaysHabit, sendVATHabit, sendPreliminaryTaxes, makeSportHabit } from "./ExampleHabits"
import { ResolvedTaskInput } from "../../models/helpers/ResolvedTaskInput"
import { tasks, resolvedTasks } from "./ExampleTasks"
import { generateTasksSinceLastResolvedDate, determineIntervalStartDate } from "../../logic/ResolveDaysInternal"

describe("Resolve days", () => {
  it("Determine resolve tasks action", () => {
    const lastResolvedDate = { day: 1, month: Month.January, year: 2019 }

    // There are some days to resolve - resolve
    expect(determineResolveTasksAction(lastResolvedDate, { day: 10, month: Month.January, year: 2019 })).toEqual(
      ResolveTasksAction.RESOLVE
    )

    // There's 1 day to resolve - resolve
    expect(determineResolveTasksAction(lastResolvedDate, { day: 2, month: Month.January, year: 2019 })).toEqual(
      ResolveTasksAction.RESOLVE
    )

    // There are 0 days to resolve (same day as lastResolvedDate) - no actions needed
    expect(determineResolveTasksAction(lastResolvedDate, { day: 1, month: Month.January, year: 2019 })).toEqual(
      ResolveTasksAction.NONE
    )

    // Last date is before lastResolvedDate - invalid state
    expect(() =>
      determineResolveTasksAction(lastResolvedDate, { day: 31, month: Month.December, year: 2018 })
    ).toThrow()

    // Last date is before lastResolvedDate - invalid state
    expect(() => determineResolveTasksAction(lastResolvedDate, { day: 1, month: Month.January, year: 2018 })).toThrow()
  })

  it("Converts task in resolved task input", () => {
    expect(
      toResolvedTaskInput({
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      })
    ).toEqual({
      habitId: wakeUpWeekdaysHabit.id,
      done: true,
      date: { day: 1, month: Month.January, year: 2019 }
    } as ResolvedTaskInput)

    expect(
      toResolvedTaskInput({
        doneStatus: TaskDoneStatus.MISSED,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      })
    ).toEqual({
      habitId: wakeUpWeekdaysHabit.id,
      done: false,
      date: { day: 1, month: Month.January, year: 2019 }
    } as ResolvedTaskInput)

    expect(
      toResolvedTaskInput({
        doneStatus: TaskDoneStatus.OPEN,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      })
    ).toEqual({
      habitId: wakeUpWeekdaysHabit.id,
      done: false,
      date: { day: 1, month: Month.January, year: 2019 }
    } as ResolvedTaskInput)
  })

  it("Filters missed tasks", () => {
    expect(filterMissedTasks(tasks)).toEqual([tasks[0], tasks[2], tasks[4]])
  })

  it("Generates tasks since last resolved date when all tasks are already resolved and done", () => {
    expect(
      generateTasksSinceLastResolvedDate(
        { day: 1, month: Month.January, year: 2019 },
        { day: 4, month: Month.January, year: 2019 },
        [wakeUpWeekdaysHabit],
        [
          {
            task: {
              id: 0,
              habitId: wakeUpWeekdaysHabit.id,
              done: true,
              date: { day: 1, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          },
          {
            task: {
              id: 1,
              habitId: wakeUpWeekdaysHabit.id,
              done: true,
              date: { day: 2, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          },
          {
            task: {
              id: 2,
              habitId: wakeUpWeekdaysHabit.id,
              done: true,
              date: { day: 3, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          },
          {
            task: {
              id: 3,
              habitId: wakeUpWeekdaysHabit.id,
              done: true,
              date: { day: 4, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          }
        ]
      )
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 2, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 3, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 4, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      }
    ])
  })

  it("Generates tasks since last resolved date when all tasks are already resolved and missed", () => {
    expect(
      generateTasksSinceLastResolvedDate(
        { day: 1, month: Month.January, year: 2019 },
        { day: 4, month: Month.January, year: 2019 },
        [wakeUpWeekdaysHabit],
        [
          {
            task: {
              id: 0,
              habitId: wakeUpWeekdaysHabit.id,
              done: false,
              date: { day: 1, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          },
          {
            task: {
              id: 1,
              habitId: wakeUpWeekdaysHabit.id,
              done: false,
              date: { day: 2, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          },
          {
            task: {
              id: 2,
              habitId: wakeUpWeekdaysHabit.id,
              done: false,
              date: { day: 3, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          },
          {
            task: {
              id: 3,
              habitId: wakeUpWeekdaysHabit.id,
              done: false,
              date: { day: 4, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          }
        ]
      )
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.MISSED,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.MISSED,
        date: { day: 2, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.MISSED,
        date: { day: 3, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.MISSED,
        date: { day: 4, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      }
    ])
  })

  it("Generates tasks since last resolved date when all tasks are already resolved and some are done and others are missed", () => {
    expect(
      generateTasksSinceLastResolvedDate(
        { day: 1, month: Month.January, year: 2019 },
        { day: 4, month: Month.January, year: 2019 },
        [wakeUpWeekdaysHabit],
        [
          {
            task: {
              id: 0,
              habitId: wakeUpWeekdaysHabit.id,
              done: true,
              date: { day: 1, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          },
          {
            task: {
              id: 1,
              habitId: wakeUpWeekdaysHabit.id,
              done: false,
              date: { day: 2, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          },
          {
            task: {
              id: 2,
              habitId: wakeUpWeekdaysHabit.id,
              done: true,
              date: { day: 3, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          },
          {
            task: {
              id: 3,
              habitId: wakeUpWeekdaysHabit.id,
              done: false,
              date: { day: 4, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          }
        ]
      )
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.MISSED,
        date: { day: 2, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 3, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.MISSED,
        date: { day: 4, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      }
    ])
  })

  it("Generates tasks since last resolved date when no tasks are resolved", () => {
    expect(
      generateTasksSinceLastResolvedDate(
        { day: 1, month: Month.January, year: 2019 },
        { day: 4, month: Month.January, year: 2019 },
        [wakeUpWeekdaysHabit],
        []
      )
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.OPEN,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.OPEN,
        date: { day: 2, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.OPEN,
        date: { day: 3, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.OPEN,
        date: { day: 4, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      }
    ])
  })

  it("Generates tasks since last resolved date when some tasks are resolved", () => {
    expect(
      generateTasksSinceLastResolvedDate(
        { day: 1, month: Month.January, year: 2019 },
        { day: 4, month: Month.January, year: 2019 },
        [wakeUpWeekdaysHabit],
        [
          {
            task: {
              id: 0,
              habitId: wakeUpWeekdaysHabit.id,
              done: true,
              date: { day: 1, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          },
          {
            task: {
              id: 1,
              habitId: wakeUpWeekdaysHabit.id,
              done: false,
              date: { day: 3, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          }
        ]
      )
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.OPEN,
        date: { day: 2, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.MISSED,
        date: { day: 3, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      {
        doneStatus: TaskDoneStatus.OPEN,
        date: { day: 4, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      }
    ])
  })

  it("Determine interval start date", async () => {
    // Pass a date and no habits. The habits are only used if no date is passed, so this is ignored.
    expect(await determineIntervalStartDate(() => Promise.resolve("2019-01-01"), () => Promise.resolve([]))).toEqual({
      kind: "date",
      date: { day: 1, month: Month.January, year: 2019 }
    })

    // Pass no date and no habits. This returns a "none" start date, as it can't be determined.
    expect(await determineIntervalStartDate(() => Promise.resolve(null), () => Promise.resolve([]))).toEqual({
      kind: "none"
    })

    // Pass no date and habits. Returns earliest start date of habits.
    expect(
      await determineIntervalStartDate(
        () => Promise.resolve(null),
        () => Promise.resolve([sendVATHabit, wakeUpWeekdaysHabit, sendPreliminaryTaxes])
      )
    ).toEqual({
      kind: "date",
      date: { day: 1, month: Month.January, year: 2019 }
    })

    // Pass date and habits. Habits are ignored.
    expect(
      await determineIntervalStartDate(
        () => Promise.resolve("2020-01-01"),
        () => Promise.resolve([sendVATHabit, wakeUpWeekdaysHabit, sendPreliminaryTaxes])
      )
    ).toEqual({
      kind: "date",
      date: { day: 1, month: Month.January, year: 2020 }
    })
  })

  it("Generate tasks for unresolved days", async () => {
    // TODO (low prio) test generateTasksForUnresolvedDays
    // for now skipping as this just solves dependencies for already tested pure functions
  })

  it("To tasks", async () => {
    // If action is NONE, we don't resolve anything - so we expect an empty task array as result
    expect(
      await toTasks(intervalStartDate => Promise.resolve([]), ResolveTasksAction.NONE, {
        day: 1,
        month: Month.January,
        year: 2019
      })
    ).toEqual([])

    // If action is RESOLVE, we call the passed function to resolve tasks and return its result
    expect(
      await toTasks(intervalStartDate => Promise.resolve([]), ResolveTasksAction.RESOLVE, {
        day: 1,
        month: Month.January,
        year: 2019
      })
    ).toEqual([])

    // If action is RESOLVE, we call the passed function to resolve tasks and return its result
    expect(
      await toTasks(
        intervalStartDate =>
          Promise.resolve([
            {
              doneStatus: TaskDoneStatus.OPEN,
              date: { day: 1, month: Month.January, year: 2019 },
              habit: wakeUpWeekdaysHabit
            },
            {
              doneStatus: TaskDoneStatus.DONE,
              date: { day: 1, month: Month.January, year: 2019 },
              habit: makeSportHabit
            }
          ]),
        ResolveTasksAction.RESOLVE,
        { day: 1, month: Month.January, year: 2019 }
      )
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.OPEN,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      { doneStatus: TaskDoneStatus.DONE, date: { day: 1, month: Month.January, year: 2019 }, habit: makeSportHabit }
    ])
  })
})
