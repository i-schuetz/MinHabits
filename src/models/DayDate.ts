import { DateUtils } from '../utils/DateUtils';
import { Month } from './Month';

export type DayDate = {
  day: number,
  month: Month,
  year: number
}

export namespace DayDate {

  export function toJSON(dayDate: DayDate): string {
    return DateUtils.toDayDateString(dayDate).formatted;
  }

  export function parse(str: string): DayDate {
    return DateUtils.parseDayDate(str);
  }
}
