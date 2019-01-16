import * as DateUtils from '../../utils/DateUtils';
import { DayDate } from '../DayDate';

// TODO unit tests

export type DailyListDayDateViewData = {
  dayDate: DayDate,
  formatted: string,
  isReferenceDate: boolean
}

export function fromDayDate(dayDate: DayDate, isReferenceDate: boolean): DailyListDayDateViewData {
  return {
    dayDate: dayDate,
    formatted: DateUtils.formatDayDateWeekdayDayTextualMonth(dayDate),
    isReferenceDate: isReferenceDate
  }
}
