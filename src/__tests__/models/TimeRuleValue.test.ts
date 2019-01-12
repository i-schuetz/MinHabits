import {
  TimeRuleValue,
  WeekdayTimeRuleValue,
  EachTimeRuleValue,
  EachTimeRuleValueJSON
} from "../../models/TimeRuleValue"
import { TimeUnit } from "../../models/TimeUnit"
import { TimeRuleValueDescriptor } from "../../models/TimeRuleTypeDescriptor"
import { Weekday } from "../../models/Weekday"

describe("TimeRuleValue.WeekdayTimeRuleValue", () => {
  it("Parses weekday rule correctly", () => {
    expect(TimeRuleValue.parse(TimeRuleValueDescriptor.Weekday, [0])).toEqual({
      kind: "weekday",
      weekdays: [Weekday.Monday]
    } as WeekdayTimeRuleValue)
    expect(TimeRuleValue.parse(TimeRuleValueDescriptor.Weekday, [0, 1, 2])).toEqual({
      kind: "weekday",
      weekdays: [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday]
    } as WeekdayTimeRuleValue)
  })

  it("Throws error parsing invalid weekday list rule value", () => {
    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Weekday, {
        value: -10,
        unit: "w"
      } as EachTimeRuleValueJSON)
    ).toThrow()
    expect(() => TimeRuleValue.parse(TimeRuleValueDescriptor.Weekday, [])).toThrow()
  })

  it("Generates correct json", () => {
    expect(TimeRuleValue.toJSON({ kind: "weekday", weekdays: [Weekday.Monday] })).toEqual([0])
    expect(
      TimeRuleValue.toJSON({ kind: "weekday", weekdays: [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday] })
    ).toEqual([0, 1, 2])
  })
})

describe("TimeRuleValue.EachTimeRuleValue", () => {
  it("Parses each time rule correctly", () => {
    expect(
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 1,
        unit: "d"
      })
    ).toEqual({ kind: "each", value: 1, unit: TimeUnit.Day } as EachTimeRuleValue)

    expect(
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 10,
        unit: "w"
      })
    ).toEqual({ kind: "each", value: 10, unit: TimeUnit.Week } as EachTimeRuleValue)

    expect(
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 100,
        unit: "m"
      })
    ).toEqual({ kind: "each", value: 100, unit: TimeUnit.Month } as EachTimeRuleValue)

    expect(
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 1000,
        unit: "y"
      })
    ).toEqual({ kind: "each", value: 1000, unit: TimeUnit.Year } as EachTimeRuleValue)
  })

  it("Throws error parsing invalid each time rule", () => {
    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: -1,
        unit: "d"
      } as EachTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: -10,
        unit: "w"
      } as EachTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 0,
        unit: "d"
      } as EachTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 0,
        unit: "y"
      } as EachTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 1,
        unit: ""
      } as EachTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 10,
        unit: "D"
      } as EachTimeRuleValueJSON)
    ).toThrow()
    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 100,
        unit: "W"
      } as EachTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 1000,
        unit: "M"
      } as EachTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 10000,
        unit: "Y"
      } as EachTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 1,
        unit: "1"
      } as EachTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: 1,
        unit: "1"
      } as EachTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Each, {
        value: -1,
        unit: "10"
      } as EachTimeRuleValueJSON)
    ).toThrow()
  })

  it("Each rule Generates correct JSON", () => {
    expect(TimeRuleValue.toJSON({ kind: "each", value: 1, unit: TimeUnit.Day })).toEqual({
      value: 1,
      unit: "d"
    } as EachTimeRuleValueJSON)
    expect(TimeRuleValue.toJSON({ kind: "each", value: 100, unit: TimeUnit.Week })).toEqual({
      value: 100,
      unit: "w"
    } as EachTimeRuleValueJSON)
    expect(TimeRuleValue.toJSON({ kind: "each", value: 1234, unit: TimeUnit.Month })).toEqual({
      value: 1234,
      unit: "m"
    } as EachTimeRuleValueJSON)
    expect(TimeRuleValue.toJSON({ kind: "each", value: 20000, unit: TimeUnit.Year })).toEqual({
      value: 20000,
      unit: "y"
    } as EachTimeRuleValueJSON)
  })
})
