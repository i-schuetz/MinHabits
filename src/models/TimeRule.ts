import { DayDate } from './DayDate';
import { TimeRuleValue, TimeRuleValueDescriptor } from './TimeRuleValue';
import { TimeRuleType } from './TimeRuleType';

export type TimeRule = {
  readonly type: TimeRuleType;
  readonly value: TimeRuleValue;
  readonly start: DayDate;
}

export namespace TimeRule {
  export function toJSON(timeRule: TimeRule): any {
    return {
      type: TimeRuleType.toString(timeRule.type),
      value: TimeRuleValue.toJson(timeRule.value),
      start: DayDate.toString(timeRule.start)
    }
  }

  export function parse(json: any): TimeRule {
    const type: TimeRuleType = TimeRuleType.parse(json["type"]);
    const valueDescriptor: TimeRuleValueDescriptor = toTimeRuleValueDescriptor(type)
    const value: TimeRuleValue = TimeRuleValue.parse(valueDescriptor, json["value"]);
    const start: DayDate = DayDate.parse(json["start"]);
    return {
      type: type,
      value: value,
      start: start
    }
  }

  function toTimeRuleValueDescriptor(type: TimeRuleType): TimeRuleValueDescriptor {
    switch (type) {
      case TimeRuleType.Weekday: 
        return TimeRuleValueDescriptor.Plain
      case TimeRuleType.TimesIn:
      case TimeRuleType.Each: 
        return TimeRuleValueDescriptor.Unit
    }
  }
}
