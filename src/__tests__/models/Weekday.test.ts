import { Weekday } from "../../models/Weekday";
import * as WeekdayHelpers from "../../models/Weekday";

describe("Month", () => {
  it("Parses weekday number correctly", () => {
    expect(WeekdayHelpers.parse(0)).toEqual(Weekday.Monday)
    expect(WeekdayHelpers.parse(1)).toEqual(Weekday.Tuesday)
    expect(WeekdayHelpers.parse(2)).toEqual(Weekday.Wednesday)
    expect(WeekdayHelpers.parse(3)).toEqual(Weekday.Thursday)
    expect(WeekdayHelpers.parse(4)).toEqual(Weekday.Friday)
    expect(WeekdayHelpers.parse(5)).toEqual(Weekday.Saturday)
    expect(WeekdayHelpers.parse(6)).toEqual(Weekday.Sunday)
  })

  it("Throws error on invalid weekday number", () => {
    expect(() => WeekdayHelpers.parse(-1)).toThrow()
    expect(() => WeekdayHelpers.parse(7)).toThrow()
  })

  it("Generates correct number", () => {
    expect(WeekdayHelpers.toJSON(Weekday.Monday)).toEqual(0)
    expect(WeekdayHelpers.toJSON(Weekday.Tuesday)).toEqual(1)
    expect(WeekdayHelpers.toJSON(Weekday.Wednesday)).toEqual(2)
    expect(WeekdayHelpers.toJSON(Weekday.Thursday)).toEqual(3)
    expect(WeekdayHelpers.toJSON(Weekday.Friday)).toEqual(4)
    expect(WeekdayHelpers.toJSON(Weekday.Saturday)).toEqual(5)
    expect(WeekdayHelpers.toJSON(Weekday.Sunday)).toEqual(6)
  })
})
