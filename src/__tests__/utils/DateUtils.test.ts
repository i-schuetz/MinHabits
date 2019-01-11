import { DateUtils } from "../../utils/DateUtils"
import { Weekday } from "../../models/Weekday"
import { Month } from "../../models/Month"
import { DayDate } from "../../models/DayDate"
import { TimeUnit } from "../../models/TimeUnit"
import TimeInterval from "../../models/TimeInterval"

describe("DateUtils", () => {
  it("Gets weekday from DayDate", () => {
    expect(DateUtils.getWeekday({ day: 1, month: Month.January, year: 2019 })).toEqual(Weekday.Tuesday)
    expect(DateUtils.getWeekday({ day: 2, month: Month.January, year: 2019 })).toEqual(Weekday.Wednesday)
    expect(DateUtils.getWeekday({ day: 3, month: Month.January, year: 2019 })).toEqual(Weekday.Thursday)
    expect(DateUtils.getWeekday({ day: 4, month: Month.January, year: 2019 })).toEqual(Weekday.Friday)
    expect(DateUtils.getWeekday({ day: 5, month: Month.January, year: 2019 })).toEqual(Weekday.Saturday)
    expect(DateUtils.getWeekday({ day: 6, month: Month.January, year: 2019 })).toEqual(Weekday.Sunday)
    expect(DateUtils.getWeekday({ day: 7, month: Month.January, year: 2019 })).toEqual(Weekday.Monday)
    expect(DateUtils.getWeekday({ day: 29, month: Month.February, year: 2016 })).toEqual(Weekday.Monday) // TODO confirm
  })

  it("Gets end from DayDate", () => {
    expect(DateUtils.getEnd({ day: 1, month: Month.January, year: 2019 }, { value: 1, unit: TimeUnit.Day })).toEqual({
      day: 2,
      month: Month.January,
      year: 2019
    } as DayDate)

    expect(DateUtils.getEnd({ day: 1, month: Month.January, year: 2019 }, { value: 10, unit: TimeUnit.Day })).toEqual({
      day: 11,
      month: Month.January,
      year: 2019
    } as DayDate)

    expect(DateUtils.getEnd({ day: 1, month: Month.January, year: 2019 }, { value: 40, unit: TimeUnit.Day })).toEqual({
      day: 10,
      month: Month.February,
      year: 2019
    } as DayDate)

    expect(DateUtils.getEnd({ day: 1, month: Month.January, year: 2019 }, { value: 1, unit: TimeUnit.Week })).toEqual({
      day: 8,
      month: Month.January,
      year: 2019
    } as DayDate)

    expect(DateUtils.getEnd({ day: 1, month: Month.January, year: 2019 }, { value: 8, unit: TimeUnit.Week })).toEqual({
      day: 26,
      month: Month.February,
      year: 2019
    } as DayDate) // TODO confirm

    expect(
      DateUtils.getEnd({ day: 15, month: Month.February, year: 2019 }, { value: 10, unit: TimeUnit.Month })
    ).toEqual({
      day: 15,
      month: Month.December,
      year: 2019
    } as DayDate)

    expect(
      DateUtils.getEnd({ day: 15, month: Month.February, year: 2019 }, { value: 12, unit: TimeUnit.Month })
    ).toEqual({
      day: 15,
      month: Month.February,
      year: 2020
    } as DayDate)

    expect(DateUtils.getEnd({ day: 18, month: Month.June, year: 2019 }, { value: 100, unit: TimeUnit.Year })).toEqual({
      day: 18,
      month: Month.June,
      year: 2119
    } as DayDate)
  })

  it("DayDate is in interval", () => {
    expect(
      DateUtils.isInInterval(
        { day: 2, month: Month.January, year: 2019 },
        { day: 1, month: Month.January, year: 2019 },
        { value: 2, unit: TimeUnit.Day }
      )
    ).toEqual(true)

    expect(
      DateUtils.isInInterval(
        { day: 1, month: Month.February, year: 2019 },
        { day: 2, month: Month.January, year: 2019 },
        { value: 1, unit: TimeUnit.Month }
      )
    ).toEqual(true)
  })

  // TODO some of these tests sometimes fail, e.g. the last one in this block. This may point to a bug in moment.js? (iirc the first one of above block failed once too)
  it("DayDate is not in interval", () => {
    // Exclusive interval - day is not in previous day + 1 day interval!
    expect(
      DateUtils.isInInterval(
        { day: 2, month: Month.January, year: 2019 },
        { day: 1, month: Month.January, year: 2019 },
        { value: 1, unit: TimeUnit.Day }
      )
    ).toEqual(false)

    // Exclusive interval - day is not in previous month + 1 month interval!
    expect(
      DateUtils.isInInterval(
        { day: 1, month: Month.February, year: 2019 },
        { day: 1, month: Month.January, year: 2019 },
        { value: 1, unit: TimeUnit.Month }
      )
    ).toEqual(false)
  })

  it("DayDate is in start end", () => {
    expect(
      DateUtils.isInStartEnd(
        { day: 2, month: Month.January, year: 2019 },
        { day: 1, month: Month.January, year: 2019 },
        { day: 3, month: Month.January, year: 2019 }
      )
    ).toEqual(true)

    expect(
      DateUtils.isInStartEnd(
        { day: 1, month: Month.February, year: 2019 },
        { day: 2, month: Month.January, year: 2019 },
        { day: 2, month: Month.February, year: 2019 }
      )
    ).toEqual(true)
  })

  it("DayDate is not in end", () => {
    // Exclusive interval - day is not in previous day + 1 day interval!
    expect(
      DateUtils.isInStartEnd(
        { day: 2, month: Month.January, year: 2019 },
        { day: 1, month: Month.January, year: 2019 },
        { day: 2, month: Month.January, year: 2019 }
      )
    ).toEqual(false)

    // Exclusive interval - day is not in previous month + 1 month interval!
    expect(
      DateUtils.isInStartEnd(
        { day: 1, month: Month.February, year: 2019 },
        { day: 2, month: Month.January, year: 2019 },
        { day: 1, month: Month.February, year: 2019 }
      )
    ).toEqual(false)
  })
})
