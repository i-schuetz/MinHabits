import { DayDate } from "./DayDate"
import { TimeUnit } from "./TimeUnit"
import { TimeRuleValueDescriptor } from "./TimeRuleTypeDescriptor";

export interface DateTimeRuleValue {
  kind: "date"
  value: DayDate
}

export type TimeRuleValue = WeekdayTimeRuleValue | EachTimeRuleValue

// TODO (2): specific date time rule value? schedule e.g. for "the 4th July each year", or "the 12th each month", 
// "the 12th each 2 months" or a specific complete date

export interface WeekdayTimeRuleValue {
  kind: "weekday"
  numbers: number[]
}

export interface EachTimeRuleValue {
  kind: "each"
  value: number
  unit: TimeUnit
}

export interface EachTimeRuleValueJSON {
  value: number,
  unit: string
}

export namespace TimeRuleValue {
  export function parse(type: TimeRuleValueDescriptor, json: number[] | EachTimeRuleValueJSON): TimeRuleValue {
    switch (type) {
      case TimeRuleValueDescriptor.Weekday:
      if (!isArrayOfNumber(json)) {
        throw new Error(`Invalid type: ${json}`)
      } 
        return parseWeekdayTimeRuleValue(json)
      case TimeRuleValueDescriptor.Each:
        if (!isUnitTimeRuleValueJSON(json)) {
          throw new Error(`Invalid type: ${json}`)
        }
        return parseEachTimeRuleValue(json)
    }
  }

  function parseWeekdayTimeRuleValue(json: number[]): WeekdayTimeRuleValue {
    if (json.length == 0 ) {
      throw new Error("Array must not be empty") // It doesn't make sense to not schedule
    }
    return {
      kind: "weekday",
      numbers: json
    }
  }

  function parseEachTimeRuleValue(json: EachTimeRuleValueJSON): EachTimeRuleValue {
    if (json.value < 1) {
      throw new Error(`Value: ${json.value} must be > 1`) // It doesn't make sense to schedule 0 or less times.
    }

    return {
      kind: "each",
      value: json.value,
      unit: TimeUnit.parse(json.unit)
    }
  }

  export function toJSON(value: TimeRuleValue): number[] | EachTimeRuleValueJSON {
    switch (value.kind) {
      case "weekday":
        return value.numbers
      case "each":
        return { value: value.value, unit: TimeUnit.toJSON(value.unit) }
    }
  }

  function isUnitTimeRuleValueJSON(json: number[] | EachTimeRuleValueJSON): json is EachTimeRuleValueJSON {
    return (<EachTimeRuleValueJSON>json).unit !== undefined;
  }

  function isArrayOfNumber(json: number[] | EachTimeRuleValueJSON): json is number[] {
    return Array.isArray(json)
  }
}
