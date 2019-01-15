import { DayDate } from './DayDate';
import * as DayDateHelpers from './DayDate';
import { TimeRuleValue, EachTimeRuleValueJSON } from './TimeRuleValue';
import { TimeRuleValueDescriptor } from './TimeRuleTypeDescriptor';
import * as TimeRuleValueDescriptorHelpers from "./TimeRuleTypeDescriptor"
import * as TimeRuleValueHelpers from "./TimeRuleValue"

export type TimeRule = {
  readonly value: TimeRuleValue;
  readonly start: DayDate;
}

export interface TimeRuleJSON {
  readonly type: "w" | "e";
  readonly value: number[] | EachTimeRuleValueJSON;
  readonly start: string;
}

export function toJSON(timeRule: TimeRule): TimeRuleJSON {
  return {
    type: TimeRuleValueDescriptorHelpers.toJSON(toTimeRuleValueDescriptor(timeRule.value)),
    value: TimeRuleValueHelpers.toJSON(timeRule.value),
    start: DayDateHelpers.toJSON(timeRule.start)
  }
}

export function parse(json: TimeRuleJSON): TimeRule {
  const valueDescriptor: TimeRuleValueDescriptor = TimeRuleValueDescriptorHelpers.parse(json["type"]);
  const value: TimeRuleValue = TimeRuleValueHelpers.parse(valueDescriptor, json["value"]);
  const start: DayDate = DayDateHelpers.parse(json["start"]);
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
