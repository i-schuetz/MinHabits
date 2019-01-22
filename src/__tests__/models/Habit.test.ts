import { Habit, HabitJSON } from "../../models/Habit"
import * as HabitHelpers from "../../models/Habit"
import { Month } from "../../models/Month"
import { TimeUnit } from "../../models/TimeUnit"
import { Weekday } from "../../models/Weekday"

describe("Habit", () => {
  it("Generates correct JSON", () => {
    expect(
      HabitHelpers.toJSON({
        id: 0,
        name: "My habit",
        time: {
          value: { kind: "weekday", weekdays: [Weekday.Tuesday, Weekday.Wednesday] },
          start: { day: 1, month: Month.January, year: 2019 }
        }
      })
    ).toEqual({
      id: 0,
      name: "My habit",
      time: {
        type: "w",
        value: [1, 2],
        start: "2019-01-01"
      }
    } as HabitJSON)

    expect(
      HabitHelpers.toJSON({
        id: 0,
        name: "My habit",
        time: {
          value: { kind: "each", value: 2, unit: TimeUnit.Month },
          start: { day: 1, month: Month.January, year: 2019 }
        }
      })
    ).toEqual({
      id: 0,
      name: "My habit",
      time: {
        type: "e",
        value: { value: 2, unit: "m" },
        start: "2019-01-01"
      }
    } as HabitJSON)
  })

  it("Parses JSON correctly", () => {
    expect(
      HabitHelpers.parse({
        id: 0,
        name: "My habit",
        time: {
          type: "w",
          value: [1, 2],
          start: "2019-01-01"
        }
      })
    ).toEqual({
      id: 0,
      name: "My habit",
      time: {
        value: { kind: "weekday", weekdays: [Weekday.Tuesday, Weekday.Wednesday] },
        start: { day: 1, month: Month.January, year: 2019 }
      }
    } as Habit)

    expect(
      HabitHelpers.parse({
        id: 0,
        name: "My habit",
        time: {
          type: "e",
          value: { value: 2, unit: "m" },
          start: "2019-01-01"
        }
      })
    ).toEqual({
      id: 0,
      name: "My habit",
      time: {
        value: { kind: "each", value: 2, unit: TimeUnit.Month },
        start: { day: 1, month: Month.January, year: 2019 }
      }
    } as Habit)
  })
})
