import { Habit } from "../../models/Habit"
import { Month } from "../../models/Month"
import { TimeUnit } from "../../models/TimeUnit"
import { Weekday } from "../../models/Weekday"

export const wakeUpWeekdaysHabit: Habit = {
  id: 0,
  name: "Wake up at 6:00",
  time: {
    value: {
      kind: "weekday",
      weekdays: [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday]
    },
    start: { day: 1, month: Month.January, year: 2019 }
  }
}

export const makeSportHabit: Habit = {
  id: 1,
  name: "Make sport",
  time: {
    value: { kind: "weekday", weekdays: [Weekday.Monday, Weekday.Wednesday, Weekday.Friday] },
    start: { day: 1, month: Month.January, year: 2019 }
  }
}

export const meditateHabit: Habit = {
  id: 2,
  name: "Meditate",
  time: {
    value: {
      kind: "weekday",
      weekdays: [
        Weekday.Monday,
        Weekday.Tuesday,
        Weekday.Wednesday,
        Weekday.Thursday,
        Weekday.Friday,
        Weekday.Saturday,
        Weekday.Sunday
      ]
    },
    start: { day: 1, month: Month.January, year: 2019 }
  }
}

export const sendVATHabit: Habit = {
  id: 3,
  name: "Send VAT",
  time: {
    value: { kind: "each", value: 1, unit: TimeUnit.Month },
    start: { day: 8, month: Month.January, year: 2019 }
  }
}

export const sendPreliminaryTaxes: Habit = {
  id: 4,
  name: "Send preliminary takes",
  time: {
    value: { kind: "each", value: 3, unit: TimeUnit.Month },
    start: { day: 1, month: Month.January, year: 2019 }
  }
}

// See note in the handling of TimesIn in GetHabitsForDate for why this is commented
// const doSomethingGood: Habit = {
//   id: 5,
//   name: "Do something good for others",
//   time: {
//     type: TimeRuleType.TimesIn,
//     value: { kind: "unit", value: 2, unit: TimeUnit.Week },
//     start: { day: 1, month: Month.January, year: 2019 }
//   }
// }

export const habits: Habit[] = [
  wakeUpWeekdaysHabit,
  makeSportHabit,
  meditateHabit,
  sendVATHabit,
  sendPreliminaryTaxes
  // doSomethingGood
]
