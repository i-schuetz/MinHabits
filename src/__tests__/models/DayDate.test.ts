import { DayDate } from "../../models/DayDate"
import * as DayDateHelpers from "../../models/DayDate"
import { Month } from "../../models/Month"
import { Order } from "../../models/helpers/Order"

describe("DayDate", () => {
  it("Parses day date string correctly", () => {
    expect(DayDateHelpers.parse("2019-01-01")).toEqual({ day: 1, month: Month.January, year: 2019 } as DayDate)
    expect(DayDateHelpers.parse("1983-02-20")).toEqual({ day: 20, month: Month.February, year: 1983 } as DayDate)
    expect(DayDateHelpers.parse("2016-02-29")).toEqual({ day: 29, month: Month.February, year: 2016 } as DayDate)
    expect(DayDateHelpers.parse("2500-10-15")).toEqual({ day: 15, month: Month.October, year: 2500 } as DayDate)
    expect(DayDateHelpers.parse("2016-12-31")).toEqual({ day: 31, month: Month.December, year: 2016 } as DayDate)
    expect(DayDateHelpers.parse("1000-04-04")).toEqual({ day: 4, month: Month.April, year: 1000 } as DayDate)
  })

  it("Generates correct string", () => {
    expect(DayDateHelpers.toJSON({ day: 1, month: Month.January, year: 2019 })).toEqual("2019-01-01")
    expect(DayDateHelpers.toJSON({ day: 20, month: Month.February, year: 1983 })).toEqual("1983-02-20")
    expect(DayDateHelpers.toJSON({ day: 29, month: Month.February, year: 2016 })).toEqual("2016-02-29")
    expect(DayDateHelpers.toJSON({ day: 15, month: Month.October, year: 2500 })).toEqual("2500-10-15")
    expect(DayDateHelpers.toJSON({ day: 31, month: Month.December, year: 2016 })).toEqual("2016-12-31")
    expect(DayDateHelpers.toJSON({ day: 4, month: Month.April, year: 1000 })).toEqual("1000-04-04")
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
