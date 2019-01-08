import {
  TimeRuleValue,
  TimeRuleValueDescriptor,
  NumberListTimeRuleValue,
  UnitTimeRuleValue,
  UnitTimeRuleValueJSON
} from "../../models/TimeRuleValue"
import { TimeUnit } from "../../models/TimeUnit"

describe("TimeRuleValue.NumberListTimeRuleValue", () => {
  it("Parses valid number list rule correctly", () => {
    expect(TimeRuleValue.parse(TimeRuleValueDescriptor.NumberList, [1])).toEqual({
      kind: "numberList",
      numbers: [1]
    } as NumberListTimeRuleValue)
    expect(TimeRuleValue.parse(TimeRuleValueDescriptor.NumberList, [1, 2, 3])).toEqual({
      kind: "numberList",
      numbers: [1, 2, 3]
    } as NumberListTimeRuleValue)
  })

  it("Throws error parsing invalid number list rule value", () => {
    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.NumberList, {
        value: -10,
        unit: "w"
      } as UnitTimeRuleValueJSON)
    ).toThrow()
    expect(() => TimeRuleValue.parse(TimeRuleValueDescriptor.NumberList, [])).toThrow()
  })

  it("Generates correct json", () => {
    expect(TimeRuleValue.toJSON({ kind: "numberList", numbers: [1] })).toEqual([1])
    expect(TimeRuleValue.toJSON({ kind: "numberList", numbers: [1, 2, 3] })).toEqual([1, 2, 3])
  })
})

describe("TimeRuleValue.UnitTimeRuleValue", () => {
  it("Parses valid unit time rule correctly", () => {
    expect(
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 1,
        unit: "d"
      })
    ).toEqual({ kind: "unit", value: 1, unit: TimeUnit.Day } as UnitTimeRuleValue)

    expect(
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 10,
        unit: "w"
      })
    ).toEqual({ kind: "unit", value: 10, unit: TimeUnit.Week } as UnitTimeRuleValue)

    expect(
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 100,
        unit: "m"
      })
    ).toEqual({ kind: "unit", value: 100, unit: TimeUnit.Month } as UnitTimeRuleValue)

    expect(
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 1000,
        unit: "y"
      })
    ).toEqual({ kind: "unit", value: 1000, unit: TimeUnit.Year } as UnitTimeRuleValue)
  })

  it("Throws error parsing invalid time rule", () => {
    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: -1,
        unit: "d"
      } as UnitTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: -10,
        unit: "w"
      } as UnitTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 0,
        unit: "d"
      } as UnitTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 0,
        unit: "y"
      } as UnitTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 1,
        unit: ""
      } as UnitTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 10,
        unit: "D"
      } as UnitTimeRuleValueJSON)
    ).toThrow()
    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 100,
        unit: "W"
      } as UnitTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 1000,
        unit: "M"
      } as UnitTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 10000,
        unit: "Y"
      } as UnitTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 1,
        unit: "1"
      } as UnitTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 1,
        unit: "1"
      } as UnitTimeRuleValueJSON)
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: -1,
        unit: "10"
      } as UnitTimeRuleValueJSON)
    ).toThrow()
  })

  it("Generates correct string", () => {
    expect(TimeRuleValue.toJSON({ kind: "unit", value: 1, unit: TimeUnit.Day })).toEqual({
      value: 1,
      unit: "d"
    } as UnitTimeRuleValueJSON)
    expect(TimeRuleValue.toJSON({ kind: "unit", value: 100, unit: TimeUnit.Week })).toEqual({
      value: 100,
      unit: "w"
    } as UnitTimeRuleValueJSON)
    expect(TimeRuleValue.toJSON({ kind: "unit", value: 1234, unit: TimeUnit.Month })).toEqual({
      value: 1234,
      unit: "m"
    } as UnitTimeRuleValueJSON)
    expect(TimeRuleValue.toJSON({ kind: "unit", value: 20000, unit: TimeUnit.Year })).toEqual({
      value: 20000,
      unit: "y"
    } as UnitTimeRuleValueJSON)
  })
})
