import { DayDate } from "../../models/DayDate"
import * as DayDateHelpers from "../../models/DayDate"
import { Month } from "../../models/Month"
import { Order } from "../../models/Order"

describe("DayDate", () => {
  it("Parses day date string correctly", () => {
    expect(DayDateHelpers.parse("01-01-2019")).toEqual({ day: 1, month: Month.January, year: 2019 } as DayDate)
    expect(DayDateHelpers.parse("20-02-1983")).toEqual({ day: 20, month: Month.February, year: 1983 } as DayDate)
    expect(DayDateHelpers.parse("29-02-2016")).toEqual({ day: 29, month: Month.February, year: 2016 } as DayDate)
    expect(DayDateHelpers.parse("15-10-2500")).toEqual({ day: 15, month: Month.October, year: 2500 } as DayDate)
    expect(DayDateHelpers.parse("31-12-2016")).toEqual({ day: 31, month: Month.December, year: 2016 } as DayDate)
    expect(DayDateHelpers.parse("04-04-1000")).toEqual({ day: 4, month: Month.April, year: 1000 } as DayDate)
  })

  it("Generates correct string", () => {
    expect(DayDateHelpers.toJSON({ day: 1, month: Month.January, year: 2019 })).toEqual("01-01-2019")
    expect(DayDateHelpers.toJSON({ day: 20, month: Month.February, year: 1983 })).toEqual("20-02-1983")
    expect(DayDateHelpers.toJSON({ day: 29, month: Month.February, year: 2016 })).toEqual("29-02-2016")
    expect(DayDateHelpers.toJSON({ day: 15, month: Month.October, year: 2500 })).toEqual("15-10-2500")
    expect(DayDateHelpers.toJSON({ day: 31, month: Month.December, year: 2016 })).toEqual("31-12-2016")
    expect(DayDateHelpers.toJSON({ day: 4, month: Month.April, year: 1000 })).toEqual("04-04-1000")
  })

  it("Can compare 2 day dates", () => {
    expect(
      DayDateHelpers.compare({ day: 1, month: Month.January, year: 2019 }, { day: 1, month: Month.January, year: 2019 })
    ).toEqual(Order.EQ)

    expect(
      DayDateHelpers.compare({ day: 2, month: Month.January, year: 2019 }, { day: 1, month: Month.January, year: 2019 })
    ).toEqual(Order.GT)

    expect(
      DayDateHelpers.compare({ day: 1, month: Month.February, year: 2019 }, { day: 1, month: Month.January, year: 2019 })
    ).toEqual(Order.GT)

    expect(
      DayDateHelpers.compare({ day: 5, month: Month.July, year: 2019 }, { day: 5, month: Month.August, year: 2019 })
    ).toEqual(Order.LT)

    expect(
      DayDateHelpers.compare({ day: 30, month: Month.December, year: 2018 }, { day: 1, month: Month.January, year: 2019 })
    ).toEqual(Order.LT)

    expect(
      DayDateHelpers.compare({ day: 1, month: Month.January, year: 2020 }, { day: 1, month: Month.January, year: 1999 })
    ).toEqual(Order.GT)
  })
})
