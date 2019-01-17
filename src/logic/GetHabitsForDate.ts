import { DayDate } from "../models/DayDate"
import { Habit } from "../models/Habit"
import TimeInterval from "../models/TimeInterval"
import { EachTimeRuleValue, WeekdayTimeRuleValue, TimeRuleValue } from "../models/TimeRuleValue"
import * as DateUtils from "../utils/DateUtils"
import { Weekday } from '../models/Weekday';
import { Order } from "../models/helpers/Order";
import * as DayDateHelpers from "../models/DayDate"

export function getHabitsForDate(date: DayDate, habits: Habit[]): Habit[] {
  return habits.filter(habit => match(date, habit))
}

export function match(date: DayDate, habit: Habit): boolean {
  const timeRule = habit.time
  switch (timeRule.value.kind) {
    case "weekday":
      return matchWeekdayRule(date, <WeekdayTimeRuleValue>timeRule.value)
    case "each": 
      return matchEachRule(date, <EachTimeRuleValue>timeRule.value, timeRule.start)
  }
}

function matchWeekdayRule(date: DayDate, ruleValue: WeekdayTimeRuleValue): boolean {
  const dateWeekday = DateUtils.getWeekday(date)
  return ruleValue.weekdays.some((weekday: Weekday) =>
    dateWeekday == weekday
  )
}

function matchEachRule(date: DayDate, ruleValue: EachTimeRuleValue, start: DayDate): boolean {
  if (DayDateHelpers.compare(date, start) == Order.EQ) {
    return true
  }

  var comparison = Order.GT
  var i = 0
  while(comparison == Order.GT) { 
    const updatedInterval: TimeInterval = { value: ruleValue.value * i, unit: ruleValue.unit }
    const end: DayDate = DateUtils.getEnd(start, updatedInterval) 
    comparison = DayDateHelpers.compare(date, end) 
    if (comparison == Order.EQ) {
      return true
    }
    i++;
  } 
  return false 
}
