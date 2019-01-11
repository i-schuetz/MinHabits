import { DayDate } from "../models/DayDate"
import { Habit } from "../models/Habit"
import { TimeRuleType } from "../models/TimeRuleType"
import TimeInterval from "../models/TimeInterval"
import { UnitTimeRuleValue, NumberListTimeRuleValue } from "../models/TimeRuleValue"
import { DateUtils } from "../utils/DateUtils"
import { Weekday } from '../models/Weekday';
import { Order } from "../models/Order";

export namespace GetHabitsForDate {

  export function getHabitsForDate(date: DayDate, habits: Habit[]): Habit[] {
    return habits.filter(habit => match(date, habit))
  }

  export function match(date: DayDate, habit: Habit): boolean {
    const timeRule = habit.time
    switch (timeRule.type) {

      case TimeRuleType.Weekday:
        return matchWeekdayRule(date, <NumberListTimeRuleValue>timeRule.value)

      case TimeRuleType.Each: 
        return matchEachRule(date, <UnitTimeRuleValue>timeRule.value, timeRule.start)

      case TimeRuleType.TimesIn:
        // const ruleValue: UnitTimeRuleValue = <UnitTimeRuleValue>timeRule.value
        // This will not be available at least in the first release of the app. Needs to be implemented.
        return false
    }
  }

  function matchWeekdayRule(date: DayDate, ruleValue: NumberListTimeRuleValue): boolean {
    const dateWeekday = DateUtils.getWeekday(date)
    return ruleValue.numbers.some((number: number) =>
      dateWeekday == Weekday.parse(number)
    )
  }

  function matchEachRule(date: DayDate, ruleValue: UnitTimeRuleValue, start: DayDate): boolean {
    if (DayDate.compare(date, start) == Order.EQ) {
      return true
    }

    var comparison = Order.GT
    var i = 0
    while(comparison == Order.GT) { 
      const updatedInterval: TimeInterval = { value: ruleValue.value * i, unit: ruleValue.unit }
      const end: DayDate = DateUtils.getEnd(start, updatedInterval) 
      comparison = DayDate.compare(date, end) 
      if (comparison == Order.EQ) {
        return true
      }
      i++;
   } 
   return false 
  }
}
