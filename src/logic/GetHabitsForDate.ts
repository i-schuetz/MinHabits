import { DayDate } from "../models/DayDate"
import { Habit } from "../models/Habit"
import { TimeRule } from "../models/TimeRule"
import { TimeRuleType } from "../models/TimeRuleType"
import TimeInterval from "../models/TimeInterval"
import { UnitTimeRuleValue } from "../models/TimeRuleValue"
import { DateUtils } from "../utils/DateUtils"

export function getHabitsForDate(date: DayDate, habits: Habit[]): Habit[] {
  return habits.filter(habit => match(date, habit.time))
}

function match(date: DayDate, timeRule: TimeRule): boolean {
  switch (timeRule.type) {
    case TimeRuleType.Weekday:
      // TODO
      // const ruleValue: NumberListTimeRuleValue = <NumberListTimeRuleValue>timeRule.value
      // const ruleWeekday: Weekday = (<any>Weekday)[ruleValue.numbers]
      // return ruleWeekday == DateUtils.getWeekday(date)
      return false

    case TimeRuleType.TimesIn: {
      const ruleValue: UnitTimeRuleValue = <UnitTimeRuleValue>timeRule.value
      const timeInterval: TimeInterval = { value: ruleValue.value, unit: ruleValue.unit }
      return DateUtils.isInInterval(date, timeRule.start, timeInterval)
    }

    case TimeRuleType.Each: {
      const ruleValue: UnitTimeRuleValue = <UnitTimeRuleValue>timeRule.value
      const timeInterval: TimeInterval = { value: ruleValue.value, unit: ruleValue.unit }
      const end = DateUtils.getEnd(timeRule.start, timeInterval)
      return date == end
    }
  }
}
