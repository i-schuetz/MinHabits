import * as DateUtils from "../../utils/DateUtils"
import { Weekday } from "../../models/Weekday"
import { Month } from "../../models/Month"
import { DayDate } from "../../models/DayDate"
import { TimeUnit } from "../../models/TimeUnit"

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
    // TODO this test sometimes fails. moment.js fault?
    expect(
      DateUtils.isInStartEnd(
        { day: 1, month: Month.February, year: 2019 },
        { day: 2, month: Month.January, year: 2019 },
        { day: 1, month: Month.February, year: 2019 }
      )
    ).toEqual(false)
  })

  it("Get day dates in week returns expected values", () => {

    // Week starts in the past year
    expect(
      DateUtils.getDayDatesInWeek(
        { day: 2, month: Month.January, year: 2019 } // Wednesday
      )
    ).toEqual([
      { day: 31, month: Month.December, year: 2018 }, // Monday
      { day: 1, month: Month.January, year: 2019 },
      { day: 2, month: Month.January, year: 2019 },
      { day: 3, month: Month.January, year: 2019 },
      { day: 4, month: Month.January, year: 2019 },
      { day: 5, month: Month.January, year: 2019 },
      { day: 6, month: Month.January, year: 2019 } // Sunday
    ] as DayDate[])

    // In year, at the start of a week. Also leap year.
    expect(
      DateUtils.getDayDatesInWeek(
        { day: 29, month: Month.February, year: 2016 } // Monday
      )
    ).toEqual([
      { day: 29, month: Month.February, year: 2016 }, // Monday
      { day: 1, month: Month.March, year: 2016 },
      { day: 2, month: Month.March, year: 2016 },
      { day: 3, month: Month.March, year: 2016 },
      { day: 4, month: Month.March, year: 2016 },
      { day: 5, month: Month.March, year: 2016 },
      { day: 6, month: Month.March, year: 2016 } // Sunday
    ] as DayDate[])

    // In year, at the end of a week
    expect(
      DateUtils.getDayDatesInWeek(
        { day: 28, month: Month.April, year: 2019 } // Sunday
      )
    ).toEqual([
      { day: 22, month: Month.April, year: 2019 }, // Monday
      { day: 23, month: Month.April, year: 2019 },
      { day: 24, month: Month.April, year: 2019 },
      { day: 25, month: Month.April, year: 2019 },
      { day: 26, month: Month.April, year: 2019 },
      { day: 27, month: Month.April, year: 2019 },
      { day: 28, month: Month.April, year: 2019 } // Sunday
    ] as DayDate[])

    // Week ends in next year
    expect(
      DateUtils.getDayDatesInWeek(
        { day: 31, month: Month.December, year: 2019 } // Tuesday
      )
    ).toEqual([
      { day: 30, month: Month.December, year: 2019 }, // Monday
      { day: 31, month: Month.December, year: 2019 },
      { day: 1, month: Month.January, year: 2020 },
      { day: 2, month: Month.January, year: 2020 },
      { day: 3, month: Month.January, year: 2020 },
      { day: 4, month: Month.January, year: 2020 },
      { day: 5, month: Month.January, year: 2020 } // Sunday
    ] as DayDate[])
  })
})
