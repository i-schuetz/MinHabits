import { TimeRule } from "../../models/TimeRule"
import { TimeRuleType } from "../../models/TimeRuleType"
import { Month } from "../../models/Month"
import { TimeUnit } from "../../models/TimeUnit"

describe("TimeRule", () => {
  it("Parses correctly weekly time rule", () => {
    expect(
      TimeRule.parse({
        type: "w",
        value: 1,
        start: "01-01-2019"
      })
    ).toEqual({
      type: TimeRuleType.Weekday,
      value: { kind: "plain", value: 1 },
      start: { day: 1, month: Month.January, year: 2019 }
    })

    expect(
      TimeRule.parse({
        type: "w",
        value: 4,
        start: "28-02-2016" // leap year
      })
    ).toEqual({
      type: TimeRuleType.Weekday,
      value: { kind: "plain", value: 4 },
      start: { day: 28, month: Month.February, year: 2016 }
    })

    // Note: values not validated! See possible todo on TimeRuleValue. This is why this test succeeds.
    expect(
      TimeRule.parse({
        type: "w",
        value: 123,
        start: "01-01-2019"
      })
    ).toEqual({
      type: TimeRuleType.Weekday,
      value: { kind: "plain", value: 123 },
      start: { day: 1, month: Month.January, year: 2019 }
    })
  })

  it("Weekly time rule generates correct JSON", () => {
    expect(
      TimeRule.toJSON({
        type: TimeRuleType.Weekday,
        value: { kind: "plain", value: 1 },
        start: { day: 1, month: Month.January, year: 2019 }
      })
    ).toEqual({
      type: "w",
      value: 1,
      start: "01-01-2019"
    })

    expect(
      TimeRule.toJSON({
        type: TimeRuleType.Weekday,
        value: { kind: "plain", value: 4 },
        start: { day: 28, month: Month.February, year: 2016 }
      })
    ).toEqual({
      type: "w",
      value: 4,
      start: "28-02-2016"
    })
  })

  it("Parses correctly 'times in' time rule", () => {
    expect(
      TimeRule.parse({
        type: "t",
        value: { value: 1, unit: "d" }, // 1 time each day
        start: "01-01-2019"
      })
    ).toEqual({
      type: TimeRuleType.TimesIn,
      value: { kind: "unit", value: 1, unit: TimeUnit.Day },
      start: { day: 1, month: Month.January, year: 2019 }
    })

    expect(
      TimeRule.parse({
        type: "t",
        value: { value: 2, unit: "w" }, // 2 times each week
        start: "28-02-2016" // leap year
      })
    ).toEqual({
      type: TimeRuleType.TimesIn,
      value: { kind: "unit", value: 2, unit: TimeUnit.Week },
      start: { day: 28, month: Month.February, year: 2016 }
    })

    expect(
      TimeRule.parse({
        type: "t",
        value: { value: 3, unit: "m" }, // 3 times each month
        start: "01-01-2019"
      })
    ).toEqual({
      type: TimeRuleType.TimesIn,
      value: { kind: "unit", value: 3, unit: TimeUnit.Month },
      start: { day: 1, month: Month.January, year: 2019 }
    })

    expect(
      TimeRule.parse({
        type: "t",
        value: { value: 4, unit: "y" }, // 4 times each year
        start: "01-01-2019"
      })
    ).toEqual({
      type: TimeRuleType.TimesIn,
      value: { kind: "unit", value: 4, unit: TimeUnit.Year },
      start: { day: 1, month: Month.January, year: 2019 }
    })
  })

  it("'Times in' rule generates correct JSON", () => {
    expect(
      TimeRule.toJSON({
        type: TimeRuleType.TimesIn,
        value: { kind: "unit", value: 1, unit: TimeUnit.Day },
        start: { day: 1, month: Month.January, year: 2019 }
      })
    ).toEqual({
      type: "t",
      value: { value: 1, unit: "d" }, // 1 time each day
      start: "01-01-2019"
    })

    expect(
      TimeRule.toJSON({
        type: TimeRuleType.TimesIn,
        value: { kind: "unit", value: 2, unit: TimeUnit.Week },
        start: { day: 28, month: Month.February, year: 2016 }
      })
    ).toEqual({
      type: "t",
      value: { value: 2, unit: "w" }, // 2 times each week
      start: "28-02-2016" // leap year
    })

    expect(
      TimeRule.toJSON({
        type: TimeRuleType.TimesIn,
        value: { kind: "unit", value: 3, unit: TimeUnit.Month },
        start: { day: 1, month: Month.January, year: 2019 }
      })
    ).toEqual({
      type: "t",
      value: { value: 3, unit: "m" }, // 3 times each month
      start: "01-01-2019"
    })

    expect(
      TimeRule.toJSON({
        type: TimeRuleType.TimesIn,
        value: { kind: "unit", value: 4, unit: TimeUnit.Year },
        start: { day: 1, month: Month.January, year: 2019 }
      })
    ).toEqual({
      type: "t",
      value: { value: 4, unit: "y" }, // 4 times each year
      start: "01-01-2019"
    })
  })

  it("Parses correctly 'each' time rule", () => {
    expect(
      TimeRule.parse({
        type: "e",
        value: { value: 1, unit: "d" }, // Each day
        start: "01-01-2019"
      })
    ).toEqual({
      type: TimeRuleType.Each,
      value: { kind: "unit", value: 1, unit: TimeUnit.Day },
      start: { day: 1, month: Month.January, year: 2019 }
    })

    expect(
      TimeRule.parse({
        type: "e",
        value: { value: 2, unit: "w" }, // Each 2 weeks 
        start: "28-02-2016" // leap year
      })
    ).toEqual({
      type: TimeRuleType.Each,
      value: { kind: "unit", value: 2, unit: TimeUnit.Week },
      start: { day: 28, month: Month.February, year: 2016 }
    })

    expect(
      TimeRule.parse({
        type: "e",
        value: { value: 3, unit: "m" }, // Each 3 months
        start: "01-01-2019"
      })
    ).toEqual({
      type: TimeRuleType.Each,
      value: { kind: "unit", value: 3, unit: TimeUnit.Month },
      start: { day: 1, month: Month.January, year: 2019 }
    })

    expect(
      TimeRule.parse({
        type: "e",
        value: { value: 4, unit: "y" }, // Each 4 years
        start: "01-01-2019"
      })
    ).toEqual({
      type: TimeRuleType.Each,
      value: { kind: "unit", value: 4, unit: TimeUnit.Year },
      start: { day: 1, month: Month.January, year: 2019 }
    })
  })

  it("'Each' rule generates correct JSON", () => {
    expect(
      TimeRule.toJSON({
        type: TimeRuleType.Each,
        value: { kind: "unit", value: 1, unit: TimeUnit.Day },
        start: { day: 1, month: Month.January, year: 2019 }
      })
    ).toEqual({
      type: "e",
      value: { value: 1, unit: "d" }, // Each day
      start: "01-01-2019"
    })

    expect(
      TimeRule.toJSON({
        type: TimeRuleType.Each,
        value: { kind: "unit", value: 2, unit: TimeUnit.Week },
        start: { day: 28, month: Month.February, year: 2016 }
      })
    ).toEqual({
      type: "e",
      value: { value: 2, unit: "w" }, // Each 2 weeks
      start: "28-02-2016" // leap year
    })

    expect(
      TimeRule.toJSON({
        type: TimeRuleType.Each,
        value: { kind: "unit", value: 3, unit: TimeUnit.Month },
        start: { day: 1, month: Month.January, year: 2019 }
      })
    ).toEqual({
      type: "e",
      value: { value: 3, unit: "m" }, // Each 3 months
      start: "01-01-2019"
    })

    expect(
      TimeRule.toJSON({
        type: TimeRuleType.Each,
        value: { kind: "unit", value: 4, unit: TimeUnit.Year },
        start: { day: 1, month: Month.January, year: 2019 }
      })
    ).toEqual({
      type: "e",
      value: { value: 4, unit: "y" }, // Each 4 years
      start: "01-01-2019"
    })
  })

})
