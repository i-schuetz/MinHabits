import { DayDate } from "./DayDate"
import { TimeUnit } from "./TimeUnit"

export interface DateTimeRuleValue {
  kind: "date"
  value: DayDate
}

// TODO should we use more specific tagged types like WeeklyTimeRuleValue (etc), such that we also can validate?
// Currently it's possible to have a TimeRule with Weekly type and a value (which is of type PlainTimeRuleValue) with
// a number > 6. The validation can be done "externally" with current types but this seems cumbersome, so not doing it.
export type TimeRuleValue = PlainTimeRuleValue | UnitTimeRuleValue

// TODO (2): specific date time rule value? schedule e.g. for "the 4th July each year", or "the 12th each month", 
// "the 12th each 2 months" or a specific complete date

export interface PlainTimeRuleValue {
  kind: "plain"
  value: number
}

export interface UnitTimeRuleValue {
  kind: "unit"
  value: number
  unit: TimeUnit
}

// TODO can we just use TimeRuleValue instead and remove this?
export enum TimeRuleValueDescriptor {
  Plain,
  Unit
}

export namespace TimeRuleValue {
  export function parse(type: TimeRuleValueDescriptor, json: any): TimeRuleValue {
    switch (type) {
      case TimeRuleValueDescriptor.Plain:
        return createPlainTimeRuleValue(json)
      case TimeRuleValueDescriptor.Unit:
        return parseUnitTimeRuleValue(json)
    }
  }

  function createPlainTimeRuleValue(json: any): PlainTimeRuleValue {
    const value: any = json

    if (typeof value !== "number") {
      throw new Error(`Invalid type: ${json}`)
    }
    if (value < 1) {
      throw new Error(`Value: ${value} must be > 1`) // It doesn't make sense to schedule 0 or less times.
    }

    return { kind: "plain", value: value }
  }

  function parseUnitTimeRuleValue(json: any): UnitTimeRuleValue {
    const unit: any = json["unit"]
    const value: any = json["value"]

    if (typeof unit !== "string") {
      throw new Error(`Invalid type: ${unit}`)
    }
    if (typeof value !== "number") {
      throw new Error(`Invalid type: ${value}`)
    }
    if (value < 1) {
      throw new Error(`Value: ${value} must be > 1`) // It doesn't make sense to schedule 0 or less times.
    }

    return {
      kind: "unit",
      value: value,
      unit: TimeUnit.parse(unit)
    }
  }

  export function toJson(value: TimeRuleValue): any {
    switch (value.kind) {
      case "plain":
        return value.value
      case "unit":
        return { value: value.value, unit: TimeUnit.toString(value.unit) }
    }
  }
}
