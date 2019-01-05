import { DayDate } from './DayDate';

export type TimeRuleValue = PlainTimeRuleValue | UnitTimeRuleValue | DateTimeRuleValue;

export interface PlainTimeRuleValue {
  kind: "plain";
  value: number;
}

export interface UnitTimeRuleValue {
  kind: "timesIn";
  value: number;
  unit: TimeUnit;
}

export interface DateTimeRuleValue {
  kind: "date";
  value: DayDate;
}

export namespace TimeRuleValue {

  export function parseUnitTime(json: any): UnitTimeRuleValue {
    return { 
      kind: "timesIn", 
      value: json["value"], 
      unit: json["unit"]
    }
  }

}