import { TimeRuleType } from "../../models/TimeRuleType"

describe("TimeRuleType", () => {
  it("Parses time rule string correctly", () => {
    expect(TimeRuleType.parse("w")).toEqual(TimeRuleType.Weekday)
    expect(TimeRuleType.parse("t")).toEqual(TimeRuleType.TimesIn)
    expect(TimeRuleType.parse("e")).toEqual(TimeRuleType.Each)
  })

  it("Throws error parsing invalid string", () => {
    expect(() => TimeRuleType.parse("")).toThrow()
    expect(() => TimeRuleType.parse("abc")).toThrow()
    expect(() => TimeRuleType.parse("W")).toThrow()
    expect(() => TimeRuleType.parse("T")).toThrow()
    expect(() => TimeRuleType.parse("E")).toThrow()
    expect(() => TimeRuleType.parse("D")).toThrow()
    expect(() => TimeRuleType.parse("0")).toThrow()
  })

  it("Generates correct string", () => {
    expect(TimeRuleType.toJSON(TimeRuleType.Weekday)).toEqual("w")
    expect(TimeRuleType.toJSON(TimeRuleType.TimesIn)).toEqual("t")
    expect(TimeRuleType.toJSON(TimeRuleType.Each)).toEqual("e")
  })
})
