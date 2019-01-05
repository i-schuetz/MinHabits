import { DayDate } from './DayDate';
import { TimeRuleValue } from './TimeRuleValue';

export type TimeRule = {
  readonly type: TimeRuleType;
  readonly value: TimeRuleValue;
  readonly start: DayDate;
}

export namespace TimeRule {
  export function toString(timeRuleType: TimeRule): string {
    return JSON.stringify(timeRuleType)
  }

  export function parse(str: string): TimeRule {
    const json: any = JSON.parse(str); // TODO how to get rid of this any?
    const type: TimeRuleType = TimeRuleType.parse(json["type"]);
    const value: TimeRuleValue = toTimeRuleValue(type, json["value"]);
    const start: DayDate = DayDate.parse(json["start"]);
    return {
      type: type,
      value: value,
      start: start
    }
  }

  function toTimeRuleValue(type: TimeRuleType, json: any): TimeRuleValue {
    switch (type) {
      case TimeRuleType.Weekday: 
      case TimeRuleType.Each: 
        return { kind: "plain", value: json as number };
      case TimeRuleType.TimesIn:
        return TimeRuleValue.parseUnitTime(json);
      case TimeRuleType.Date:
        return { kind: "date", value: DayDate.parse(json) };
    }
  }
}
