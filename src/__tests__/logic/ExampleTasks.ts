import { ResolvedTask } from "../../models/ResolvedTask"
import { Month } from "../../models/Month"

export const tasks: ResolvedTask[] = [
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

export const tasksWithManyFailed: ResolvedTask[] = [
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
