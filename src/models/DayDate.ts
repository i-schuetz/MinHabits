import { DateUtils } from '../utils/DateUtils';
import { Month } from './Month';
import { Order } from './Order';

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

  export function compare(dayDate1: DayDate, dayDate2: DayDate): Order {
    // function toOrder(difference: number): Order {
    //   return difference == 0 ? Order.EQ : (difference < 0 ? Order.LT : Order.GT)
    // }
    // switch (toOrder(dayDate1.year - dayDate2.year)) {
    //   case Order.LT: return Order.LT
    //   case Order.GT: return Order.GT
    //   case Order.EQ: {
    //     switch (toOrder(dayDate1.month - dayDate2.month)) {
    //     case Order.LT: return Order.LT
    //     case Order.GT: return Order.GT
    //     case Order.EQ: return (toOrder(dayDate1.day - dayDate2.day)) 
    //   }
    // }
    if (dayDate1.year < dayDate2.year) {
      return Order.LT 
    } else if (dayDate1.year > dayDate2.year) {
      return Order.GT
    } else { // Same year
      if (dayDate1.month < dayDate2.month) {
        return Order.LT
      } else if (dayDate1.month > dayDate2.month) {
        return Order.GT
      } else { // Same month
        if (dayDate1.day < dayDate2.day) {
          return Order.LT
        } else if (dayDate1.day > dayDate2.day) {
          return Order.GT
        } else {
          return Order.EQ
        }
      }
    }
  }
}
