import { TimeRuleValueDescriptor } from "../../models/TimeRuleTypeDescriptor"
import * as TimeRuleValueDescriptorHelpers from "../../models/TimeRuleTypeDescriptor"

describe("TimeRuleTypeDescriptor", () => {
  it("Parses time rule string correctly", () => {
    expect(TimeRuleValueDescriptorHelpers.parse("w")).toEqual(TimeRuleValueDescriptor.Weekday)
    expect(TimeRuleValueDescriptorHelpers.parse("e")).toEqual(TimeRuleValueDescriptor.Each)
  })

  it("Throws error parsing invalid string", () => {
    expect(() => TimeRuleValueDescriptorHelpers.parse("")).toThrow()
    expect(() => TimeRuleValueDescriptorHelpers.parse("abc")).toThrow()
    expect(() => TimeRuleValueDescriptorHelpers.parse("W")).toThrow()
    expect(() => TimeRuleValueDescriptorHelpers.parse("T")).toThrow()
    expect(() => TimeRuleValueDescriptorHelpers.parse("E")).toThrow()
    expect(() => TimeRuleValueDescriptorHelpers.parse("D")).toThrow()
    expect(() => TimeRuleValueDescriptorHelpers.parse("0")).toThrow()
  })

  it("Generates correct string", () => {
    expect(TimeRuleValueDescriptorHelpers.toJSON(TimeRuleValueDescriptor.Weekday)).toEqual("w")
    expect(TimeRuleValueDescriptorHelpers.toJSON(TimeRuleValueDescriptor.Each)).toEqual("e")
  })
})
