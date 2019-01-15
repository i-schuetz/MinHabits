import { TimeRule, TimeRuleJSON } from "../../models/TimeRule"
import * as TimeRuleHelpers from "../../models/TimeRule"
import { Month } from "../../models/Month"
import { TimeUnit } from "../../models/TimeUnit"
import { Weekday } from "../../models/Weekday"

describe("TimeRule", () => {
  it("Parses correctly weekly time rule", () => {
    expect(
      TimeRuleHelpers.parse({
        type: "w",
        value: [0],
        start: "01-01-2019"
      } as TimeRuleJSON)
    ).toEqual({
      value: { kind: "weekday", weekdays: [Weekday.Monday] },
      start: { day: 1, month: Month.January, year: 2019 }
    } as TimeRule)

    expect(
      TimeRuleHelpers.parse({
        type: "w",
        value: [0, 1, 3, 5],
        start: "28-02-2016" // leap year
      } as TimeRuleJSON)
    ).toEqual({
      value: { kind: "weekday", weekdays: [Weekday.Monday, Weekday.Tuesday, Weekday.Thursday, Weekday.Saturday] },
      start: { day: 28, month: Month.February, year: 2016 }
    } as TimeRule)

    expect(() =>
      TimeRuleHelpers.parse({
        type: "w",
        value: [123],
        start: "01-01-2019"
      } as TimeRuleJSON)
    ).toThrow()
  })

  it("Weekly time rule generates correct JSON", () => {
    expect(
      TimeRuleHelpers.toJSON({
        value: { kind: "weekday", weekdays: [Weekday.Monday] },
        start: { day: 1, month: Month.January, year: 2019 }
      })
    ).toEqual({
      type: "w",
      value: [0],
      start: "01-01-2019"
    } as TimeRuleJSON)

    expect(
      TimeRuleHelpers.toJSON({
        value: { kind: "weekday", weekdays: [Weekday.Monday, Weekday.Tuesday, Weekday.Thursday, Weekday.Saturday] },
        start: { day: 28, month: Month.February, year: 2016 }
      })
    ).toEqual({
      type: "w",
      value: [0, 1, 3, 5],
      start: "28-02-2016"
    } as TimeRuleJSON)
  })

  it("Parses correctly 'each' time rule", () => {
    expect(
      TimeRuleHelpers.parse({
        type: "e",
        value: { value: 1, unit: "d" }, // Each day
        start: "01-01-2019"
      } as TimeRuleJSON)
    ).toEqual({
      value: { kind: "each", value: 1, unit: TimeUnit.Day },
      start: { day: 1, month: Month.January, year: 2019 }
    } as TimeRule)

    expect(
      TimeRuleHelpers.parse({
        type: "e",
        value: { value: 2, unit: "w" }, // Each 2 weeks
        start: "28-02-2016" // leap year
      } as TimeRuleJSON)
    ).toEqual({
      value: { kind: "each", value: 2, unit: TimeUnit.Week },
      start: { day: 28, month: Month.February, year: 2016 }
    } as TimeRule)

    expect(
      TimeRuleHelpers.parse({
        type: "e",
        value: { value: 3, unit: "m" }, // Each 3 months
        start: "01-01-2019"
      } as TimeRuleJSON)
    ).toEqual({
      value: { kind: "each", value: 3, unit: TimeUnit.Month },
      start: { day: 1, month: Month.January, year: 2019 }
    } as TimeRule)

    expect(
      TimeRuleHelpers.parse({
        type: "e",
        value: { value: 4, unit: "y" }, // Each 4 years
        start: "01-01-2019"
      } as TimeRuleJSON)
    ).toEqual({
      value: { kind: "each", value: 4, unit: TimeUnit.Year },
      start: { day: 1, month: Month.January, year: 2019 }
    } as TimeRule)
  })

  it("'Each' rule generates correct JSON", () => {
    expect(
      TimeRuleHelpers.toJSON({
        value: { kind: "each", value: 1, unit: TimeUnit.Day },
        start: { day: 1, month: Month.January, year: 2019 }
      })
    ).toEqual({
      type: "e",
      value: { value: 1, unit: "d" }, // Each day
      start: "01-01-2019"
    } as TimeRuleJSON)

    expect(
      TimeRuleHelpers.toJSON({
        value: { kind: "each", value: 2, unit: TimeUnit.Week },
        start: { day: 28, month: Month.February, year: 2016 }
      })
    ).toEqual({
      type: "e",
      value: { value: 2, unit: "w" }, // Each 2 weeks
      start: "28-02-2016" // leap year
    } as TimeRuleJSON)

    expect(
      TimeRuleHelpers.toJSON({
        value: { kind: "each", value: 3, unit: TimeUnit.Month },
        start: { day: 1, month: Month.January, year: 2019 }
      })
    ).toEqual({
      type: "e",
      value: { value: 3, unit: "m" }, // Each 3 months
      start: "01-01-2019"
    } as TimeRuleJSON)

    expect(
      TimeRuleHelpers.toJSON({
        value: { kind: "each", value: 4, unit: TimeUnit.Year },
        start: { day: 1, month: Month.January, year: 2019 }
      })
    ).toEqual({
      type: "e",
      value: { value: 4, unit: "y" }, // Each 4 years
      start: "01-01-2019"
    } as TimeRuleJSON)
  })
})
