import { Task } from "../../models/Task"
import { Month } from "../../models/Month"

export const tasks: Task[] = [
  { habitId: 0, done: true, date: { day: 1, month: Month.January, year: 2019} },
  { habitId: 1, done: true, date: { day: 1, month: Month.January, year: 2019} },
  { habitId: 2, done: true, date: { day: 1, month: Month.January, year: 2019} },

  { habitId: 0, done: true, date: { day: 2, month: Month.January, year: 2019} },
  { habitId: 1, done: false, date: { day: 2, month: Month.January, year: 2019} },
  { habitId: 2, done: true, date: { day: 2, month: Month.January, year: 2019} },

  { habitId: 0, done: false, date: { day: 3, month: Month.February, year: 2019} },
  { habitId: 1, done: true, date: { day: 3, month: Month.February, year: 2019} },
  { habitId: 2, done: false, date: { day: 3, month: Month.February, year: 2019} },

  { habitId: 0, done: true, date: { day: 7, month: Month.March, year: 2019} },
  { habitId: 1, done: true, date: { day: 7, month: Month.March, year: 2019} },
  { habitId: 2, done: true, date: { day: 7, month: Month.March, year: 2019} },
]

export const tasksWithManyFailed: Task[] = [
  { habitId: 0, done: true, date: { day: 1, month: Month.January, year: 2019} },
  { habitId: 1, done: false, date: { day: 1, month: Month.January, year: 2019} },
  { habitId: 2, done: false, date: { day: 1, month: Month.January, year: 2019} },

  { habitId: 0, done: true, date: { day: 2, month: Month.January, year: 2019} },
  { habitId: 1, done: false, date: { day: 2, month: Month.January, year: 2019} },
  { habitId: 2, done: false, date: { day: 2, month: Month.January, year: 2019} },

  { habitId: 0, done: true, date: { day: 3, month: Month.February, year: 2019} },
  { habitId: 1, done: true, date: { day: 3, month: Month.February, year: 2019} },
  { habitId: 2, done: false, date: { day: 3, month: Month.February, year: 2019} },

  { habitId: 0, done: true, date: { day: 7, month: Month.March, year: 2019} },
  { habitId: 1, done: true, date: { day: 7, month: Month.March, year: 2019} },
  { habitId: 2, done: false, date: { day: 7, month: Month.March, year: 2019} },
]
