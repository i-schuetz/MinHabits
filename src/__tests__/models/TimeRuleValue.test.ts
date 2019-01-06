import { TimeRuleValue, TimeRuleValueDescriptor } from "../../models/TimeRuleValue"
import { TimeUnit } from "../../models/TimeUnit"

describe("TimeRuleValue.PlainTimeRuleValue", () => {
  it("Parses valid plain time rule correctly", () => {
    expect(TimeRuleValue.parse(TimeRuleValueDescriptor.Plain, 1)).toEqual({ kind: "plain", value: 1 })
    expect(TimeRuleValue.parse(TimeRuleValueDescriptor.Plain, 1000000000)).toEqual({
      kind: "plain",
      value: 1000000000
    })
  })

  it("Throws error parsing invalid plain time rule value", () => {
    expect(() => TimeRuleValue.parse(TimeRuleValueDescriptor.Plain, "1")).toThrow()
    expect(() => TimeRuleValue.parse(TimeRuleValueDescriptor.Plain, "2")).toThrow()

    expect(() => TimeRuleValue.parse(TimeRuleValueDescriptor.Plain, 0)).toThrow()
    expect(() => TimeRuleValue.parse(TimeRuleValueDescriptor.Plain, -1)).toThrow()
    expect(() => TimeRuleValue.parse(TimeRuleValueDescriptor.Plain, -1000000000)).toThrow()
  })

  it("Generates correct string", () => {
    expect(TimeRuleValue.toJson({ kind: "plain", value: 1 })).toEqual(1)
    expect(TimeRuleValue.toJson({ kind: "plain", value: 1000000000 })).toEqual(1000000000)
  })
})

describe("TimeRuleValue.UnitTimeRuleValue", () => {
  it("Parses valid unit time rule correctly", () => {
    expect(
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 1,
        unit: "d"
      })
    ).toEqual({ kind: "unit", value: 1, unit: TimeUnit.Day })

    expect(
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 10,
        unit: "w"
      })
    ).toEqual({ kind: "unit", value: 10, unit: TimeUnit.Week })

    expect(
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 100,
        unit: "m"
      })
    ).toEqual({ kind: "unit", value: 100, unit: TimeUnit.Month })

    expect(
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 1000,
        unit: "y"
      })
    ).toEqual({ kind: "unit", value: 1000, unit: TimeUnit.Year })
  })

  it("Throws error parsing invalid time rule", () => {
    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: -1,
        unit: "d"
      })
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: -10,
        unit: "w"
      })
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 0,
        unit: "d"
      })
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 0,
        unit: "y"
      })
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 1,
        unit: ""
      })
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 10,
        unit: "D"
      })
    ).toThrow()
    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 100,
        unit: "W"
      })
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 1000,
        unit: "M"
      })
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 10000,
        unit: "Y"
      })
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 1,
        unit: "1"
      })
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: 1,
        unit: 1
      })
    ).toThrow()

    expect(() =>
      TimeRuleValue.parse(TimeRuleValueDescriptor.Unit, {
        value: -1,
        unit: 10
      })
    ).toThrow()
  })

  it("Generates correct string", () => {
    expect(TimeRuleValue.toJson({ kind: "unit", value: 1, unit: TimeUnit.Day })).toEqual({ value: 1, unit: "d" })
    expect(TimeRuleValue.toJson({ kind: "unit", value: 100, unit: TimeUnit.Week })).toEqual({ value: 100, unit: "w" })
    expect(TimeRuleValue.toJson({ kind: "unit", value: 1234, unit: TimeUnit.Month })).toEqual({
      value: 1234,
      unit: "m"
    })
    expect(TimeRuleValue.toJson({ kind: "unit", value: 20000, unit: TimeUnit.Year })).toEqual({
      value: 20000,
      unit: "y"
    })
  })
})
