import { ResolvedTask } from "../models/ResolvedTask"
import { Month } from "../models/Month"
import { Task, TaskDoneStatus } from "../models/helpers/Task";
import { wakeUpWeekdaysHabit, makeSportHabit, meditateHabit, sendVATHabit, sendPreliminaryTaxes } from "./ExampleHabits"

export const tasks: Task[] = [
  { doneStatus: TaskDoneStatus.OPEN, date: { day: 1, month: Month.January, year: 2019}, habit: wakeUpWeekdaysHabit },
  { doneStatus: TaskDoneStatus.DONE, date: { day: 1, month: Month.January, year: 2019}, habit: makeSportHabit },
  { doneStatus: TaskDoneStatus.MISSED, date: { day: 1, month: Month.January, year: 2019}, habit: meditateHabit },
  { doneStatus: TaskDoneStatus.DONE, date: { day: 1, month: Month.January, year: 2019}, habit: sendVATHabit },
  { doneStatus: TaskDoneStatus.MISSED, date: { day: 1, month: Month.January, year: 2019}, habit: sendPreliminaryTaxes }
]

export const resolvedTasks: ResolvedTask[] = [
  { id: 0, habitId: 0, done: true, date: { day: 1, month: Month.January, year: 2019} },
  { id: 1, habitId: 1, done: true, date: { day: 1, month: Month.January, year: 2019} },
  { id: 2, habitId: 2, done: true, date: { day: 1, month: Month.January, year: 2019} },

  { id: 3, habitId: 0, done: true, date: { day: 2, month: Month.January, year: 2019} },
  { id: 4, habitId: 1, done: false, date: { day: 2, month: Month.January, year: 2019} },
  { id: 5, habitId: 2, done: true, date: { day: 2, month: Month.January, year: 2019} },

  { id: 6, habitId: 0, done: false, date: { day: 3, month: Month.February, year: 2019} },
  { id: 7, habitId: 1, done: true, date: { day: 3, month: Month.February, year: 2019} },
  { id: 8, habitId: 2, done: false, date: { day: 3, month: Month.February, year: 2019} },

  { id: 9, habitId: 0, done: true, date: { day: 7, month: Month.March, year: 2019} },
  { id: 10, habitId: 1, done: true, date: { day: 7, month: Month.March, year: 2019} },
  { id: 11, habitId: 2, done: true, date: { day: 7, month: Month.March, year: 2019} },
]

export const resolvedTasksWithManyFailed: ResolvedTask[] = [
  { id: 0, habitId: 0, done: true, date: { day: 1, month: Month.January, year: 2019} },
  { id: 1, habitId: 1, done: false, date: { day: 1, month: Month.January, year: 2019} },
  { id: 2, habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019} },

  { id: 3, habitId: 0, done: true, date: { day: 2, month: Month.January, year: 2019} },
  { id: 4, habitId: 1, done: false, date: { day: 2, month: Month.January, year: 2019} },
  { id: 5, habitId: 2, done: false, date: { day: 2, month: Month.January, year: 2019} },

  { id: 6, habitId: 0, done: true, date: { day: 3, month: Month.February, year: 2019} },
  { id: 7, habitId: 1, done: true, date: { day: 3, month: Month.February, year: 2019} },
  { id: 8, habitId: 2, done: false, date: { day: 3, month: Month.February, year: 2019} },

  { id: 9, habitId: 0, done: true, date: { day: 7, month: Month.March, year: 2019} },
  { id: 10, habitId: 1, done: true, date: { day: 7, month: Month.March, year: 2019} },
  { id: 11, habitId: 2, done: false, date: { day: 7, month: Month.March, year: 2019} },
]
