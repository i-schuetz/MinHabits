import { DayDate } from './DayDate';
import { TimeRuleValue, EachTimeRuleValueJSON } from './TimeRuleValue';
import { TimeRuleValueDescriptor } from './TimeRuleTypeDescriptor';

export type TimeRule = {
  readonly value: TimeRuleValue;
  readonly start: DayDate;
}

export interface TimeRuleJSON {
  readonly type: "w" | "e";
  readonly value: number[] | EachTimeRuleValueJSON;
  readonly start: string;
}

export namespace TimeRule {
  export function toJSON(timeRule: TimeRule): TimeRuleJSON {
    return {
      type: TimeRuleValueDescriptor.toJSON(toTimeRuleValueDescriptor(timeRule.value)),
      value: TimeRuleValue.toJSON(timeRule.value),
      start: DayDate.toJSON(timeRule.start)
    }
  }

  export function parse(json: TimeRuleJSON): TimeRule {
    const valueDescriptor: TimeRuleValueDescriptor = TimeRuleValueDescriptor.parse(json["type"]);
    const value: TimeRuleValue = TimeRuleValue.parse(valueDescriptor, json["value"]);
    const start: DayDate = DayDate.parse(json["start"]);
    return {
      value: value,
      start: start
    }
  }

  function toTimeRuleValueDescriptor(value: TimeRuleValue): TimeRuleValueDescriptor {
    switch (value.kind) {
      case "weekday": return TimeRuleValueDescriptor.Weekday
      case "each": return TimeRuleValueDescriptor.Each
    }
  }
}
