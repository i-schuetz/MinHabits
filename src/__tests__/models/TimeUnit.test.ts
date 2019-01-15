import { TimeUnit } from "../../models/TimeUnit"
import * as TimeUnitHelpers from "../../models/TimeUnit"

describe("TimeUnit", () => {
  it("Parses time rule string correctly", () => {
    expect(TimeUnitHelpers.parse("d")).toEqual(TimeUnit.Day)
    expect(TimeUnitHelpers.parse("w")).toEqual(TimeUnit.Week)
    expect(TimeUnitHelpers.parse("m")).toEqual(TimeUnit.Month)
    expect(TimeUnitHelpers.parse("y")).toEqual(TimeUnit.Year)
  })

  it("Throws error parsing invalid string", () => {
    expect(() => TimeUnitHelpers.parse("")).toThrow()
    expect(() => TimeUnitHelpers.parse("abc")).toThrow()
    expect(() => TimeUnitHelpers.parse("D")).toThrow()
    expect(() => TimeUnitHelpers.parse("W")).toThrow()
    expect(() => TimeUnitHelpers.parse("M")).toThrow()
    expect(() => TimeUnitHelpers.parse("Y")).toThrow()
    expect(() => TimeUnitHelpers.parse("0")).toThrow()
  })

  it("Generates correct string", () => {
    expect(TimeUnitHelpers.toJSON(TimeUnit.Day)).toEqual("d")
    expect(TimeUnitHelpers.toJSON(TimeUnit.Week)).toEqual("w")
    expect(TimeUnitHelpers.toJSON(TimeUnit.Month)).toEqual("m")
    expect(TimeUnitHelpers.toJSON(TimeUnit.Year)).toEqual("y")
  })
})
