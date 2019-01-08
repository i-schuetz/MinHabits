import { TimeUnit } from "../../models/TimeUnit"

describe("TimeUnit", () => {
  it("Parses time rule string correctly", () => {
    expect(TimeUnit.parse("d")).toEqual(TimeUnit.Day)
    expect(TimeUnit.parse("w")).toEqual(TimeUnit.Week)
    expect(TimeUnit.parse("m")).toEqual(TimeUnit.Month)
    expect(TimeUnit.parse("y")).toEqual(TimeUnit.Year)
  })

  it("Throws error parsing invalid string", () => {
    expect(() => TimeUnit.parse("")).toThrow()
    expect(() => TimeUnit.parse("abc")).toThrow()
    expect(() => TimeUnit.parse("D")).toThrow()
    expect(() => TimeUnit.parse("W")).toThrow()
    expect(() => TimeUnit.parse("M")).toThrow()
    expect(() => TimeUnit.parse("Y")).toThrow()
    expect(() => TimeUnit.parse("0")).toThrow()
  })

  it("Generates correct string", () => {
    expect(TimeUnit.toJSON(TimeUnit.Day)).toEqual("d")
    expect(TimeUnit.toJSON(TimeUnit.Week)).toEqual("w")
    expect(TimeUnit.toJSON(TimeUnit.Month)).toEqual("m")
    expect(TimeUnit.toJSON(TimeUnit.Year)).toEqual("y")
  })
})
