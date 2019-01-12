import { TimeRuleValueDescriptor } from "../../models/TimeRuleTypeDescriptor"

describe("TimeRuleTypeDescriptor", () => {
  it("Parses time rule string correctly", () => {
    expect(TimeRuleValueDescriptor.parse("w")).toEqual(TimeRuleValueDescriptor.Weekday)
    expect(TimeRuleValueDescriptor.parse("e")).toEqual(TimeRuleValueDescriptor.Each)
  })

  it("Throws error parsing invalid string", () => {
    expect(() => TimeRuleValueDescriptor.parse("")).toThrow()
    expect(() => TimeRuleValueDescriptor.parse("abc")).toThrow()
    expect(() => TimeRuleValueDescriptor.parse("W")).toThrow()
    expect(() => TimeRuleValueDescriptor.parse("T")).toThrow()
    expect(() => TimeRuleValueDescriptor.parse("E")).toThrow()
    expect(() => TimeRuleValueDescriptor.parse("D")).toThrow()
    expect(() => TimeRuleValueDescriptor.parse("0")).toThrow()
  })

  it("Generates correct string", () => {
    expect(TimeRuleValueDescriptor.toJSON(TimeRuleValueDescriptor.Weekday)).toEqual("w")
    expect(TimeRuleValueDescriptor.toJSON(TimeRuleValueDescriptor.Each)).toEqual("e")
  })
})
