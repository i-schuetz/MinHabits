import { Habit, HabitJSON } from "../../models/Habit"
import { Month } from "../../models/Month"
import { TimeUnit } from "../../models/TimeUnit"
import { Weekday } from "../../models/Weekday";

describe("Habit", () => {
  it("Generates correct JSON", () => {
    expect(
      Habit.toJSON({
        name: "My habit",
        time: {
          value: { kind: "weekday", weekdays: [Weekday.Tuesday, Weekday.Wednesday] },
          start: { day: 1, month: Month.January, year: 2019 }
        }
      })
    ).toEqual({
      name: "My habit",
      time: {
        type: "w",
        value: [1, 2],
        start:"01-01-2019"
      }
    } as HabitJSON)

    expect(
      Habit.toJSON({
        name: "My habit",
        time: {
          value: { kind: "each", value: 2, unit: TimeUnit.Month },
          start: { day: 1, month: Month.January, year: 2019 }
        }
      })
    ).toEqual({
      name: "My habit",
      time: {
        type: "e",
        value: { value: 2, unit: "m" },
        start: "01-01-2019"
      }
    } as HabitJSON)
  })

  it("Parses JSON correctly", () => {
    expect(
      Habit.parse({
        name: "My habit",
        time: {
          type: "w",
          value: [1, 2],
          start: "01-01-2019"
        }
      })
    ).toEqual({
      name: "My habit",
      time: {
        value: { kind: "weekday", weekdays: [Weekday.Tuesday, Weekday.Wednesday] },
        start: { day: 1, month: Month.January, year: 2019 }
      }
    } as Habit)

    expect(
      Habit.parse({
        name: "My habit",
        time: {
          type: "e",
          value: { value: 2, unit: "m" },
          start: "01-01-2019"
        }
      })
    ).toEqual({
      name: "My habit",
      time: {
        value: { kind: "each", value: 2, unit: TimeUnit.Month },
        start: { day: 1, month: Month.January, year: 2019 }
      }
    } as Habit)
  })
})
