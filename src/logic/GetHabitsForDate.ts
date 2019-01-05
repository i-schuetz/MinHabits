import { DayDate } from '../models/DayDate';
import Habit from '../models/Habit';
import { TimeRule } from '../models/TimeRule';
import TimeInterval from '../models/TimeInterval';
import { UnitTimeRuleValue, DateTimeRuleValue, PlainTimeRuleValue } from '../models/TimeRuleValue';
import { DateUtils } from '../utils/DateUtils';

export function getHabitsForDate(date: DayDate, habits: Habit[]): Habit[] {
  return habits.filter((habit) =>
    match(date, habit.time)
  )
}

function match(date: DayDate, timeRule: TimeRule): boolean {
  switch (timeRule.type) {
    case TimeRuleType.Weekday: 
      const ruleValue: PlainTimeRuleValue = <PlainTimeRuleValue>timeRule.value;
      const ruleWeekday: Weekday = (<any>Weekday)[ruleValue.value];
      return ruleWeekday == DateUtils.getWeekday(date);

    case TimeRuleType.TimesIn: {
      const ruleValue: UnitTimeRuleValue = <UnitTimeRuleValue>timeRule.value;
      const timeInterval: TimeInterval = { value: ruleValue.value, unit: ruleValue.unit };
      return DateUtils.isInInterval(date, timeRule.start, timeInterval);
    }

    case TimeRuleType.Date: 
      const ruleDate = <DateTimeRuleValue>timeRule.value;
      return date == ruleDate.value;

    case TimeRuleType.Each: {
      const ruleValue: UnitTimeRuleValue = <UnitTimeRuleValue>timeRule.value;
      const timeInterval: TimeInterval = { value: ruleValue.value, unit: ruleValue.unit };
      const end = DateUtils.getEnd(timeRule.start, timeInterval);
      return date == end;
    }
  }
}
