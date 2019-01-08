import { DayDate } from './DayDate';
import { TimeRuleValue, TimeRuleValueDescriptor, UnitTimeRuleValueJSON } from './TimeRuleValue';
import { TimeRuleType } from './TimeRuleType';

export type TimeRule = {
  readonly type: TimeRuleType;
  readonly value: TimeRuleValue;
  readonly start: DayDate;
}

export interface TimeRuleJSON {
  readonly type: string;
  readonly value: number | number[] | UnitTimeRuleValueJSON;
  readonly start: string;
}

export namespace TimeRule {
  export function toJSON(timeRule: TimeRule): TimeRuleJSON {
    return {
      type: TimeRuleType.toJSON(timeRule.type),
      value: TimeRuleValue.toJSON(timeRule.value),
      start: DayDate.toJSON(timeRule.start)
    }
  }

  export function parse(json: TimeRuleJSON): TimeRule {
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
        return TimeRuleValueDescriptor.NumberList
      case TimeRuleType.TimesIn:
      case TimeRuleType.Each: 
        return TimeRuleValueDescriptor.Unit
    }
  }
}
