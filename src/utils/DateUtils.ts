import * as moment from "moment-timezone"
import { DayDate } from "../models/DayDate"
import { Month } from "../models/Month"
import * as MonthHelpers from "../models/Month"
import { TimeUnit } from "../models/TimeUnit"
import TimeInterval from "../models/TimeInterval"
import { Weekday } from "../models/Weekday"
import * as DayDateHelpers from "../models/DayDate"
import { Order } from "../models/helpers/Order"

const dayDateFormat = "YYYY-MM-DD" // Internal
const dayDateDailyHabitListDateSelectorFormat = "dddd Do MMM"
const weekdayDateFormat = "dddd"
const monthNameFormat = "MMMM"
const monthShortNameFormat = "MMM"

const timezone = "UTC" // Use always UTC to prevent timezone convertion.

export function getWeekday(date: DayDate): Weekday {
  return toWeekday(toMomentFromDayDate(date).isoWeekday())
}

export function today(): DayDate {
  return toDayDateFromMoment(moment.tz(timezone))
}

export function yesterday(): DayDate {
  return addDay(today(), -1)
}

export function isPast(dayDate: DayDate): boolean {
  return DayDateHelpers.compare(dayDate, today()) == Order.LT
}

export function getEnd(start: DayDate, interval: TimeInterval): DayDate {
  const endDate = toMomentFromDayDate(start).add(interval.value, toMomentUnitString(interval.unit))
  return { day: endDate.date(), month: toMonth(endDate.month()), year: endDate.year() }
}

export function isInInterval(date: DayDate, start: DayDate, timeInterval: TimeInterval): boolean {
  const end = getEnd(start, timeInterval)
  return isInStartEnd(date, start, end)
}

export function isInStartEnd(date: DayDate, start: DayDate, end: DayDate): boolean {
  return toMomentFromDayDate(date).isBetween(toMomentFromDayDate(start), toMomentFromDayDate(end))
}

/**
 * @returns day dates between start and end (inclusive on both ends).
 */
export function generateDateRange(start: DayDate, end: DayDate): DayDate[] {
  const startEndComparison = DayDateHelpers.compare(start, end)

  if (startEndComparison == Order.GT) {
    throw Error(`Start: ${JSON.stringify(start)} must be smaller or equal than/to end: ${JSON.stringify(end)}`)
  }

  const momentStart = toMomentFromDayDate(start)
  const momentEnd = toMomentFromDayDate(end)
  var dates = [start]
  while (momentStart.add(1, "days").diff(momentEnd, "days", false) < 0) {
    const momentBetween = momentStart.clone()
    dates.push(toDayDateFromMoment(momentBetween))
  }

  if (startEndComparison != Order.EQ) {
    dates.push(end)
  }

  return dates
}

export function addDay(start: DayDate, number: number): DayDate {
  return toDayDateFromMoment(toMomentFromDayDate(start).add(number, "days"))
}

export function addWeek(start: DayDate, number: number): DayDate {
  return toDayDateFromMoment(toMomentFromDayDate(start).add(number, "week"))
}

/**
 * Returns internal DayDate representation, used for serialization
 * @param dayDate date to be formatted
 * @returns tuple with formatted date and format string.
 */
export function toDayDateString(dayDate: DayDate): { formatted: string; format: string } {
  return {
    formatted: toMomentFromDayDate(dayDate).format(dayDateFormat),
    format: dayDateFormat
  }
}

export function parseDayDate(str: string): DayDate {
  const mom = toMomentFromString(str, dayDateFormat)

  if (JSON.stringify(mom) == "null") {
    // Validation hack - if str is invalid, mom will be NaN, but the compiler doesn't let us check for NaN!
    throw new Error(`Couldn't parse day date string: ${str}`)
  }

  return {
    day: mom.date(),
    month: parseMonth(mom.month()),
    year: mom.year()
  }
}

/**
 * Format currently used in daily habit list date selector
 * @param dayDate to be formatted
 * @returns formatted date
 * TODO unit test
 */
export function formatDayDateWeekdayDayTextualMonth(dayDate: DayDate): string {
  return toMomentFromDayDate(dayDate).format(dayDateDailyHabitListDateSelectorFormat)
}

export function formatWeekday(dayDate: DayDate): string {
  return toMomentFromDayDate(dayDate).format(weekdayDateFormat)
}

/**
 * @return dates for Monday - Sunday of dayDate's week
 */
export function getDayDatesInWeek(dayDate: DayDate): DayDate[] {
  const weekday: Weekday = getWeekday(dayDate)
  const weekdayIndex = to0BasedIndexWeekday(weekday)

  var dayDates: DayDate[] = []
  for (var weekdayOffset = -weekdayIndex; weekdayOffset < -weekdayIndex + 7; weekdayOffset += 1) {
    const weekDayMoment = toMomentFromDayDate(dayDate).add(weekdayOffset, toMomentUnitString(TimeUnit.Day))
    dayDates.push(toDayDateFromMoment(weekDayMoment))
  }
  return dayDates
}

/**
 * Converts moment lib month index to Month
 */
function parseMonth(index: number): Month {
  return MonthHelpers.parseNumber(index)
}

export function monthName(month: Month): string {
  return toMomentWithMonth(month).format(monthNameFormat)
}

export function monthShortName(month: Month): string {
  return toMomentWithMonth(month).format(monthShortNameFormat)
}

/**
 * @returns moment with specified month. The rest of the date is irrelevant. This is used only to get month names.
 */
function toMomentWithMonth(month: Month): moment.Moment {
  return moment.tz(timezone).month(toMomentMonth(month))
}

/**
 * Note: Completely unrelated with all other weekday <-> number mapping functions.
 * In this case we want to convert to number for calculatory purposes.
 * @param weekday to be converted
 * @return weekday's index, 0 based, starting with Monday
 */
function to0BasedIndexWeekday(weekday: Weekday): number {
  switch (weekday) {
    case Weekday.Monday:
      return 0
    case Weekday.Tuesday:
      return 1
    case Weekday.Wednesday:
      return 2
    case Weekday.Thursday:
      return 3
    case Weekday.Friday:
      return 4
    case Weekday.Saturday:
      return 5
    case Weekday.Sunday:
      return 6
  }
}

function toWeekday(momentIsoWeekday: number): Weekday {
  switch (momentIsoWeekday) {
    case 1:
      return Weekday.Monday
    case 2:
      return Weekday.Tuesday
    case 3:
      return Weekday.Wednesday
    case 4:
      return Weekday.Thursday
    case 5:
      return Weekday.Friday
    case 6:
      return Weekday.Saturday
    case 7:
      return Weekday.Sunday
    default:
      throw new Error(`Invalid iso weekday: ${momentIsoWeekday}`)
  }
}

function toMomentUnitString(unit: TimeUnit): moment.DurationInputArg2 {
  switch (unit) {
    case TimeUnit.Day:
      return "days"
    case TimeUnit.Week:
      return "weeks"
    case TimeUnit.Month:
      return "months"
    case TimeUnit.Year:
      return "years"
  }
}

function toMonth(momentMonth: number) {
  switch (momentMonth) {
    case 0:
      return Month.January
    case 1:
      return Month.February
    case 2:
      return Month.March
    case 3:
      return Month.April
    case 4:
      return Month.May
    case 5:
      return Month.June
    case 6:
      return Month.July
    case 7:
      return Month.August
    case 8:
      return Month.September
    case 9:
      return Month.October
    case 10:
      return Month.November
    case 11:
      return Month.December
    default:
      throw new Error(`Invalid moment month: ${momentMonth}`)
  }
}

function toMomentMonth(month: Month) {
  switch (month) {
    case Month.January:
      return 0
    case Month.February:
      return 1
    case Month.March:
      return 2
    case Month.April:
      return 3
    case Month.May:
      return 4
    case Month.June:
      return 5
    case Month.July:
      return 6
    case Month.August:
      return 7
    case Month.September:
      return 8
    case Month.October:
      return 9
    case Month.November:
      return 10
    case Month.December:
      return 11
  }
}

function toMomentFromDayDate(dayDate: DayDate): moment.Moment {
  // Note: Setters have to be called in decresing order (year-month-date) for leap years to work properly.
  // See https://github.com/moment/moment/issues/3041
  return moment
    .tz(timezone)
    .year(dayDate.year)
    .month(toMomentMonth(dayDate.month))
    .date(dayDate.day)
}

function toDayDateFromMoment(moment: moment.Moment): DayDate {
  return { day: moment.date(), month: toMonth(moment.month()), year: moment.year() }
}

function toMomentFromString(formatted: string, format: string): moment.Moment {
  return moment.tz(formatted, format, true, timezone)
}
