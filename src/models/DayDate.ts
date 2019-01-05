import { DateUtils } from '../utils/DateUtils';

export type DayDate = {
  day: number,
  month: Month,
  year: number
}

export namespace DayDate {

  export function toString(dayDate: DayDate): string {
    return DateUtils.toDayDateString(dayDate).formatted;
  }

  export function parse(str: string): DayDate {
    return DateUtils.parseDayDate(str);
  }
}
