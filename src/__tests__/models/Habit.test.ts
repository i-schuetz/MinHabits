import { Habit, HabitJSON } from "../../models/Habit"
import { TimeRuleType } from "../../models/TimeRuleType"
import { Month } from "../../models/Month"
import { TimeUnit } from "../../models/TimeUnit"

describe("Habit", () => {
  it("Generates correct JSON", () => {
    expect(
      Habit.toJSON({
        name: "My habit",
        time: {
          type: TimeRuleType.Weekday,
          value: { kind: "numberList", numbers: [1, 2] },
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
          type: TimeRuleType.TimesIn,
          value: { kind: "unit", value: 2, unit: TimeUnit.Month },
          start: { day: 1, month: Month.January, year: 2019 }
        }
      })
    ).toEqual({
      name: "My habit",
      time: {
        type: "t",
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
        type: TimeRuleType.Weekday,
        value: { kind: "numberList", numbers: [1, 2] },
        start: { day: 1, month: Month.January, year: 2019 }
      }
    } as Habit)

    expect(
      Habit.parse({
        name: "My habit",
        time: {
          type: "t",
          value: { value: 2, unit: "m" },
          start: "01-01-2019"
        }
      })
    ).toEqual({
      name: "My habit",
      time: {
        type: TimeRuleType.TimesIn,
        value: { kind: "unit", value: 2, unit: TimeUnit.Month },
        start: { day: 1, month: Month.January, year: 2019 }
      }
    } as Habit)
  })
})
