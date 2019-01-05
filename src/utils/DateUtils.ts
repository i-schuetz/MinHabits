import * as moment from 'moment';
import { DayDate } from '../models/DayDate';
import TimeInterval from '../models/TimeInterval';

export namespace DateUtils {
  
  const dayDateFormat = "DD-MM-YYYY" 

  export function getWeekday(date: DayDate): Weekday {
    return toWeekday(toMoment(date).isoWeekday());
  }
  
  export function getEnd(start: DayDate, interval: TimeInterval): DayDate {
    const endDate = toMoment(start).add(1, toMomentUnitString(interval.unit))
    return { day: endDate.day(), month: toMonth(endDate.month()), year: endDate.year() }
  } 
  
  export function isInInterval(date: DayDate, start: DayDate, timeInterval: TimeInterval): boolean {
    const end = getEnd(start, timeInterval);
    return isInStartEnd(date, start, end);
  }
  
  export function isInStartEnd(date: DayDate, start: DayDate, end: DayDate): boolean {
    return toMoment(date).isBetween(toMoment(start), toMoment(end));
  }

  /**
   * @param dayDate date to convert
   * @returns typle with string representation and format string.
   */
  export function toDayDateString(dayDate: DayDate): {formatted: string, format: string} {
    return {
      formatted: `${dayDate.day}-${dayDate.month}-${dayDate.year}`, 
      format: dayDateFormat
    };
  }

  export function parseDayDate(str: string): DayDate {
    const mom = moment(str, dayDateFormat);
    return {
      day: mom.day(),
      month: parseMonth(mom.month()),
      year: mom.year()
    }
  }

  /**
   * Converts moment lib month index to Month
   */
  function parseMonth(index: number): Month {
    return Month.parseNumber(index - 1); // moment's months are 1-indexed
  }

  function toWeekday(momentIsoWeekday: number): Weekday {
    switch (momentIsoWeekday) {
      case 1: return Weekday.Monday;
      case 2: return Weekday.Tuesday;
      case 3: return Weekday.Wednesday;
      case 4: return Weekday.Thursday;
      case 5: return Weekday.Friday;
      case 6: return Weekday.Saturday;
      case 7: return Weekday.Sunday;
      default: throw new Error(`Invalid iso weekday: ${momentIsoWeekday}`)
    }
  }

  function toMomentUnitString(unit: TimeUnit): moment.DurationInputArg2 {
    switch (unit) {
      case TimeUnit.Day: return "days";
      case TimeUnit.Week: return "weeks";
      case TimeUnit.Month: return "months";
      case TimeUnit.Year: return "years";
    }
  }

  function toMonth(momentMonth: number) {
    switch (momentMonth) {
      case 1: return Month.January;
      case 2: return Month.February;
      case 3: return Month.March;
      case 4: return Month.April;
      case 5: return Month.May;
      case 6: return Month.June;
      case 7: return Month.July;
      case 8: return Month.August;
      case 9: return Month.September;
      case 10: return Month.October;
      case 11: return Month.November;
      case 12: return Month.December;
      default: throw new Error(`Invalid moment month: ${momentMonth}`) 
    }
  }

  function toMoment(dayDate: DayDate): moment.Moment {
    const {formatted, format} = toDayDateString(dayDate);
    return moment(formatted, format);
  }
}
