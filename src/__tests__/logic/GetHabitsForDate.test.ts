import { Month } from "../../models/Month"
import * as GetHabitsForDate from "../../logic/GetHabitsForDate"
import { wakeUpWeekdaysHabit, makeSportHabit, meditateHabit, sendVATHabit, sendPreliminaryTaxes } from "./ExampleHabits"

describe("GetHabitsForDate", () => {
  it("Matches weekday habits", () => {
    expect(GetHabitsForDate.match({ day: 1, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 2, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 3, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 4, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 5, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 6, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 7, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 8, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 9, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 10, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 11, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 12, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 13, month: Month.January, year: 2019 }, wakeUpWeekdaysHabit)).toEqual(false)

    expect(GetHabitsForDate.match({ day: 1, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 2, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 3, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 4, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 5, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 6, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 7, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 8, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 9, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 10, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 11, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 12, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 13, month: Month.January, year: 2019 }, makeSportHabit)).toEqual(false)

    expect(GetHabitsForDate.match({ day: 1, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 2, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 3, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 4, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 5, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 6, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 7, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 8, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 9, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 10, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 11, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 12, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 13, month: Month.January, year: 2019 }, meditateHabit)).toEqual(true)
  })

  it("Matches 'each' habits (VAT example)", () => {
    // The VAT is scheduled each month starting the 08.01.2019

    // Past month
    expect(GetHabitsForDate.match({ day: 7, month: Month.December, year: 2018 }, sendVATHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 8, month: Month.December, year: 2018 }, sendVATHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 9, month: Month.December, year: 2018 }, sendVATHabit)).toEqual(false)

    // // Same month
    expect(GetHabitsForDate.match({ day: 1, month: Month.January, year: 2019 }, sendVATHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 2, month: Month.January, year: 2019 }, sendVATHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 3, month: Month.January, year: 2019 }, sendVATHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 4, month: Month.January, year: 2019 }, sendVATHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 5, month: Month.January, year: 2019 }, sendVATHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 6, month: Month.January, year: 2019 }, sendVATHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 7, month: Month.January, year: 2019 }, sendVATHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 8, month: Month.January, year: 2019 }, sendVATHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 9, month: Month.January, year: 2019 }, sendVATHabit)).toEqual(false)

    // Next month
    expect(GetHabitsForDate.match({ day: 7, month: Month.February, year: 2019 }, sendVATHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 8, month: Month.February, year: 2019 }, sendVATHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 9, month: Month.February, year: 2019 }, sendVATHabit)).toEqual(false)

    // In a few months
    expect(GetHabitsForDate.match({ day: 7, month: Month.December, year: 2019 }, sendVATHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 8, month: Month.December, year: 2019 }, sendVATHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 9, month: Month.December, year: 2019 }, sendVATHabit)).toEqual(false)

    // Many years in the future
    expect(GetHabitsForDate.match({ day: 7, month: Month.December, year: 2189 }, sendVATHabit)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 8, month: Month.December, year: 2189 }, sendVATHabit)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 9, month: Month.December, year: 2189 }, sendVATHabit)).toEqual(false)
  })

  it("Matches 'each' habits (Preliminary taxes example)", () => {
    // The preliminary taxes payments are scheduled each 4 months starting the 01.01.2019

    // Past 1/4 Year
    expect(GetHabitsForDate.match({ day: 1, month: Month.October, year: 2018 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 2, month: Month.October, year: 2018 }, sendPreliminaryTaxes)).toEqual(false)

    // Same 1/4 year
    expect(GetHabitsForDate.match({ day: 1, month: Month.January, year: 2019 }, sendPreliminaryTaxes)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 2, month: Month.January, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 3, month: Month.January, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 4, month: Month.January, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 5, month: Month.January, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 6, month: Month.January, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 7, month: Month.January, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 8, month: Month.January, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 9, month: Month.January, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)

    // Next 2 months - since it's each 1/4 year, the 01. should be false
    expect(GetHabitsForDate.match({ day: 1, month: Month.February, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 2, month: Month.February, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 1, month: Month.March, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 2, month: Month.March, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)

    // Next 1/4 year
    expect(GetHabitsForDate.match({ day: 1, month: Month.April, year: 2019 }, sendPreliminaryTaxes)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 2, month: Month.April, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)

    // Next 2 months - since it's each 1/4 year, the 01. should be false
    expect(GetHabitsForDate.match({ day: 1, month: Month.May, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 2, month: Month.May, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 1, month: Month.June, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 2, month: Month.June, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)

    // Next 1/4 year
    expect(GetHabitsForDate.match({ day: 1, month: Month.July, year: 2019 }, sendPreliminaryTaxes)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 2, month: Month.July, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)

    // Next 2 months - since it's each 1/4 year, the 01. should be false
    expect(GetHabitsForDate.match({ day: 1, month: Month.August, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 2, month: Month.August, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 1, month: Month.September, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 2, month: Month.September, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)

    // Next 1/4 year
    expect(GetHabitsForDate.match({ day: 1, month: Month.October, year: 2019 }, sendPreliminaryTaxes)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 2, month: Month.October, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)

    // Next 2 months - since it's each 1/4 year, the 01. should be false
    expect(GetHabitsForDate.match({ day: 1, month: Month.November, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 2, month: Month.November, year: 2019 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 1, month: Month.December, year: 2189 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 2, month: Month.December, year: 2189 }, sendPreliminaryTaxes)).toEqual(false)

    // Next 1/4 year
    expect(GetHabitsForDate.match({ day: 1, month: Month.January, year: 2020 }, sendPreliminaryTaxes)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 2, month: Month.January, year: 2020 }, sendPreliminaryTaxes)).toEqual(false)

    // Random 1/4 year far in the future
    expect(GetHabitsForDate.match({ day: 1, month: Month.July, year: 2220 }, sendPreliminaryTaxes)).toEqual(true)
    expect(GetHabitsForDate.match({ day: 2, month: Month.July, year: 2220 }, sendPreliminaryTaxes)).toEqual(false)

    // Random non-1/4 year month far in the future
    expect(GetHabitsForDate.match({ day: 1, month: Month.August, year: 2220 }, sendPreliminaryTaxes)).toEqual(false)
    expect(GetHabitsForDate.match({ day: 2, month: Month.August, year: 2220 }, sendPreliminaryTaxes)).toEqual(false)
  })
})
