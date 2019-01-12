import { Weekday } from "../../models/Weekday";

describe("Month", () => {
  it("Parses weekday number correctly", () => {
    expect(Weekday.parse(0)).toEqual(Weekday.Monday)
    expect(Weekday.parse(1)).toEqual(Weekday.Tuesday)
    expect(Weekday.parse(2)).toEqual(Weekday.Wednesday)
    expect(Weekday.parse(3)).toEqual(Weekday.Thursday)
    expect(Weekday.parse(4)).toEqual(Weekday.Friday)
    expect(Weekday.parse(5)).toEqual(Weekday.Saturday)
    expect(Weekday.parse(6)).toEqual(Weekday.Sunday)
  })

  it("Throws error on invalid weekday number", () => {
    expect(() => Weekday.parse(-1)).toThrow()
    expect(() => Weekday.parse(7)).toThrow()
  })

  it("Generates correct number", () => {
    expect(Weekday.toJSON(Weekday.Monday)).toEqual(0)
    expect(Weekday.toJSON(Weekday.Tuesday)).toEqual(1)
    expect(Weekday.toJSON(Weekday.Wednesday)).toEqual(2)
    expect(Weekday.toJSON(Weekday.Thursday)).toEqual(3)
    expect(Weekday.toJSON(Weekday.Friday)).toEqual(4)
    expect(Weekday.toJSON(Weekday.Saturday)).toEqual(5)
    expect(Weekday.toJSON(Weekday.Sunday)).toEqual(6)
  })
})
