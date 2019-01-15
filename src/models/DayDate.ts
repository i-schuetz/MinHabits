import * as DateUtils from '../utils/DateUtils';
import { Month } from './Month';
import { Order } from './Order';

export type DayDate = {
  day: number,
  month: Month,
  year: number
}

export function toJSON(dayDate: DayDate): string {
  return DateUtils.toDayDateString(dayDate).formatted;
}

export function parse(str: string): DayDate {
  return DateUtils.parseDayDate(str);
}

export function compare(dayDate1: DayDate, dayDate2: DayDate): Order {

  function numCompare(x: number, y: number) {
    if(x > y) return Order.GT;
    if(x < y) return Order.LT;
    return Order.EQ;
  }

  const result = [
    numCompare(dayDate1.year, dayDate2.year),
    numCompare(dayDate1.month, dayDate2.month),
    numCompare(dayDate1.day, dayDate2.day),
  ].find(o => o !== Order.EQ) 
  return result === undefined ? Order.EQ : result
}
