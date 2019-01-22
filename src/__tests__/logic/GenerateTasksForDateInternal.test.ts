import { Month } from "../../models/Month"
import { TaskDoneStatus, Task } from "../../models/helpers/Task"
import { wakeUpWeekdaysHabit, meditateHabit, makeSportHabit } from "../../__tests_deps/ExampleHabits"
import {
  mapMaybeResolvedTaskToDoneStatusForOpenDate,
  mergeTasksWithSameOpenDate,
  generateTaskForResolvedTask,
  generateTaskForHabit
} from "../../logic/GenerateTasksForDateInternal"

describe("GenerateTasksForDateIn", () => {
  it("Maps maybe resolved task to done status", () => {
    expect(
      mapMaybeResolvedTaskToDoneStatusForOpenDate({
        task: { id: 0, habitId: meditateHabit.id, done: true, date: { day: 1, month: Month.January, year: 2019 } },
        habit: meditateHabit
      })
    ).toEqual(TaskDoneStatus.DONE)

    expect(
      mapMaybeResolvedTaskToDoneStatusForOpenDate({
        task: { id: 0, habitId: meditateHabit.id, done: false, date: { day: 1, month: Month.January, year: 2019 } },
        habit: meditateHabit
      })
    ).toEqual(TaskDoneStatus.MISSED)

    // No resolved task means that the task is still open (open basically means not resolved)
    expect(mapMaybeResolvedTaskToDoneStatusForOpenDate(undefined)).toEqual(TaskDoneStatus.OPEN)
  })

  it("Merges tasks with same date", () => {
    // ResolvedTask with done: true updates status of task from OPEN to DONE
    expect(
      mergeTasksWithSameOpenDate(
        [
          {
            doneStatus: TaskDoneStatus.OPEN,
            date: { day: 1, month: Month.January, year: 2019 },
            habit: wakeUpWeekdaysHabit
          }
        ],
        [
          {
            task: {
              id: 0,
              habitId: wakeUpWeekdaysHabit.id,
              done: true,
              date: { day: 1, month: Month.January, year: 2019 }
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
      }
    ])

    // ResolvedTask with done: true updates status of task from MISSED to DONE
    expect(
      mergeTasksWithSameOpenDate(
        [
          {
            doneStatus: TaskDoneStatus.MISSED,
            date: { day: 1, month: Month.January, year: 2019 },
            habit: wakeUpWeekdaysHabit
          }
        ],
        [
          {
            task: {
              id: 0,
              habitId: wakeUpWeekdaysHabit.id,
              done: true,
              date: { day: 1, month: Month.January, year: 2019 }
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
      }
    ])

    // ResolvedTask with done: true updates status of task from DONE to DONE (no-op)
    expect(
      mergeTasksWithSameOpenDate(
        [
          {
            doneStatus: TaskDoneStatus.DONE,
            date: { day: 1, month: Month.January, year: 2019 },
            habit: wakeUpWeekdaysHabit
          }
        ],
        [
          {
            task: {
              id: 0,
              habitId: wakeUpWeekdaysHabit.id,
              done: true,
              date: { day: 1, month: Month.January, year: 2019 }
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
      }
    ])

    // ResolvedTask with done: false updates status of task from OPEN to MISSED
    expect(
      mergeTasksWithSameOpenDate(
        [
          {
            doneStatus: TaskDoneStatus.OPEN,
            date: { day: 1, month: Month.January, year: 2019 },
            habit: wakeUpWeekdaysHabit
          }
        ],
        [
          {
            task: {
              id: 0,
              habitId: wakeUpWeekdaysHabit.id,
              done: false,
              date: { day: 1, month: Month.January, year: 2019 }
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
      }
    ])

    // ResolvedTask with done: false updates status of task from DONE to MISSED
    expect(
      mergeTasksWithSameOpenDate(
        [
          {
            doneStatus: TaskDoneStatus.DONE,
            date: { day: 1, month: Month.January, year: 2019 },
            habit: wakeUpWeekdaysHabit
          }
        ],
        [
          {
            task: {
              id: 0,
              habitId: wakeUpWeekdaysHabit.id,
              done: false,
              date: { day: 1, month: Month.January, year: 2019 }
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
      }
    ])

    // ResolvedTask with done: false updates status of task from MISSED to MISSED (no-op)
    expect(
      mergeTasksWithSameOpenDate(
        [
          {
            doneStatus: TaskDoneStatus.MISSED,
            date: { day: 1, month: Month.January, year: 2019 },
            habit: wakeUpWeekdaysHabit
          }
        ],
        [
          {
            task: {
              id: 0,
              habitId: wakeUpWeekdaysHabit.id,
              done: false,
              date: { day: 1, month: Month.January, year: 2019 }
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
      }
    ])

    // If there's no resolved task, task's status stays OPEN
    expect(
      mergeTasksWithSameOpenDate(
        [
          {
            doneStatus: TaskDoneStatus.OPEN,
            date: { day: 1, month: Month.January, year: 2019 },
            habit: wakeUpWeekdaysHabit
          }
        ],
        []
      )
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.OPEN,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      }
    ])

    // If there's no resolved task, task's status changes from MISSED to OPEN
    // This may be unclear - a MISSED task without a resolved task is essentially an invalid state.
    // When there's no resolved task for a task, it means that the task is open
    // (open means basically that the task is not resolved, which means that it doesn't have a resolved task).
    // So the status of the incoming task is just ignored. The result is always OPEN
    expect(
      mergeTasksWithSameOpenDate(
        [
          {
            doneStatus: TaskDoneStatus.MISSED,
            date: { day: 1, month: Month.January, year: 2019 },
            habit: wakeUpWeekdaysHabit
          }
        ],
        []
      )
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.OPEN,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      }
    ])

    // If there's no resolved task, task's status changes from DONE to OPEN
    // Same explanation as MISSED -> OPEN (see above) applies. No resolved task means always that the task is still open.
    expect(
      mergeTasksWithSameOpenDate(
        [
          {
            doneStatus: TaskDoneStatus.DONE,
            date: { day: 1, month: Month.January, year: 2019 },
            habit: wakeUpWeekdaysHabit
          }
        ],
        []
      )
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.OPEN,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      }
    ])

    // Empty array returns empty array
    expect(mergeTasksWithSameOpenDate([], [])).toEqual([])

    // Empty array with resolved tasks returns empty array
    expect(
      mergeTasksWithSameOpenDate(
        [],
        [
          {
            task: {
              id: 0,
              habitId: wakeUpWeekdaysHabit.id,
              done: false,
              date: { day: 1, month: Month.January, year: 2019 }
            },
            habit: wakeUpWeekdaysHabit
          }
        ]
      )
    ).toEqual([])

    // Miscellaneous input
    expect(
      mergeTasksWithSameOpenDate(
        [
          {
            doneStatus: TaskDoneStatus.OPEN,
            date: { day: 1, month: Month.January, year: 2019 },
            habit: wakeUpWeekdaysHabit
          },
          {
            doneStatus: TaskDoneStatus.DONE,
            date: { day: 1, month: Month.January, year: 2019 },
            habit: makeSportHabit
          },
          {
            doneStatus: TaskDoneStatus.MISSED,
            date: { day: 1, month: Month.January, year: 2019 },
            habit: meditateHabit
          }
        ],
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
              habitId: makeSportHabit.id,
              done: false,
              date: { day: 1, month: Month.January, year: 2019 }
            },
            habit: makeSportHabit
          },
          {
            task: { id: 2, habitId: meditateHabit.id, done: true, date: { day: 1, month: Month.January, year: 2019 } },
            habit: meditateHabit
          }
        ]
      )
    ).toEqual([
      {
        doneStatus: TaskDoneStatus.DONE,
        date: { day: 1, month: Month.January, year: 2019 },
        habit: wakeUpWeekdaysHabit
      },
      { doneStatus: TaskDoneStatus.MISSED, date: { day: 1, month: Month.January, year: 2019 }, habit: makeSportHabit },
      { doneStatus: TaskDoneStatus.DONE, date: { day: 1, month: Month.January, year: 2019 }, habit: meditateHabit }
    ])
  })

  it("Generates task for resolved task", () => {
    expect(
      generateTaskForResolvedTask({
        task: { id: 0, habitId: meditateHabit.id, done: true, date: { day: 1, month: Month.January, year: 2019 } },
        habit: meditateHabit
      })
    ).toEqual({
      doneStatus: TaskDoneStatus.DONE,
      date: { day: 1, month: Month.January, year: 2019 },
      habit: meditateHabit
    } as Task)

    expect(
      generateTaskForResolvedTask({
        task: { id: 0, habitId: wakeUpWeekdaysHabit.id, done: false, date: { day: 3, month: Month.March, year: 2021 } },
        habit: wakeUpWeekdaysHabit
      })
    ).toEqual({
      doneStatus: TaskDoneStatus.MISSED,
      date: { day: 3, month: Month.March, year: 2021 },
      habit: wakeUpWeekdaysHabit
    } as Task)
  })

  it("Generates task for habit", () => {
    expect(generateTaskForHabit({ day: 5, month: Month.April, year: 2022 }, meditateHabit)).toEqual({
      doneStatus: TaskDoneStatus.OPEN,
      date: { day: 5, month: Month.April, year: 2022 },
      habit: meditateHabit
    } as Task)

    expect(generateTaskForHabit({ day: 20, month: Month.September, year: 2111 }, wakeUpWeekdaysHabit)).toEqual({
      doneStatus: TaskDoneStatus.OPEN,
      date: { day: 20, month: Month.September, year: 2111 },
      habit: wakeUpWeekdaysHabit
    } as Task)
  })
})
