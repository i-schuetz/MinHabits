import * as MathUtils from "../../utils/MathUtils"

describe("MathUtils", () => {
  it("Gets digits from number", () => {
    const number = 1234567222890112
    expect(MathUtils.getDigit(number, 0)).toEqual(1)
    expect(MathUtils.getDigit(number, 1)).toEqual(2)
    expect(MathUtils.getDigit(number, 2)).toEqual(3)
    expect(MathUtils.getDigit(number, 3)).toEqual(4)
    expect(MathUtils.getDigit(number, 4)).toEqual(5)
    expect(MathUtils.getDigit(number, 5)).toEqual(6)
    expect(MathUtils.getDigit(number, 6)).toEqual(7)
    expect(MathUtils.getDigit(number, 7)).toEqual(2)
    expect(MathUtils.getDigit(number, 8)).toEqual(2)
    expect(MathUtils.getDigit(number, 9)).toEqual(2)
    expect(MathUtils.getDigit(number, 10)).toEqual(8)
    expect(MathUtils.getDigit(number, 11)).toEqual(9)
    expect(MathUtils.getDigit(number, 12)).toEqual(0)
    expect(MathUtils.getDigit(number, 13)).toEqual(1)
    expect(MathUtils.getDigit(number, 14)).toEqual(1)
    expect(MathUtils.getDigit(number, 15)).toEqual(2)
    expect(() => MathUtils.getDigit(number, 16)).toThrow()

    expect(MathUtils.getDigit(1000, 0)).toEqual(1)
    expect(MathUtils.getDigit(1000, 1)).toEqual(0)
    expect(MathUtils.getDigit(1000, 2)).toEqual(0)
    expect(MathUtils.getDigit(1000, 3)).toEqual(0)
    expect(() => MathUtils.getDigit(1000, 4)).toThrow()

    expect(MathUtils.getDigit(0, 0)).toEqual(0)
    expect(() => MathUtils.getDigit(0, 1)).toThrow()

    expect(() => MathUtils.getDigit(-1, 0)).toThrow()
    expect(() => MathUtils.getDigit(-1, 1)).toThrow()

    expect(MathUtils.getDigit(1.1, 0)).toEqual(1)
    expect(() => MathUtils.getDigit(1.1, 1)).toThrow()
    
    expect(() => MathUtils.getDigit(1, 1)).toThrow()
    expect(() => MathUtils.getDigit(1, 2)).toThrow()
    expect(() => MathUtils.getDigit(123, 3)).toThrow()
    expect(() => MathUtils.getDigit(123, 4)).toThrow()

    expect(() => MathUtils.getDigit(NaN, 0)).toThrow()
    expect(() => MathUtils.getDigit(0, NaN)).toThrow()
    expect(() => MathUtils.getDigit(NaN, NaN)).toThrow()
  })

  it("Gets digits count", () => {
    expect(MathUtils.getDigitCount(1)).toEqual(1)
    expect(MathUtils.getDigitCount(12)).toEqual(2)
    expect(MathUtils.getDigitCount(111)).toEqual(3)
    expect(MathUtils.getDigitCount(1234567222890112)).toEqual(16)
    expect(MathUtils.getDigitCount(1.1)).toEqual(1)
    expect(MathUtils.getDigitCount(1.12345)).toEqual(1)
    expect(MathUtils.getDigitCount(21.12345)).toEqual(2)
    expect(MathUtils.getDigitCount(0.12345)).toEqual(1)
    expect(MathUtils.getDigitCount(.12345)).toEqual(1)

    expect(() => MathUtils.getDigitCount(NaN)).toThrow()
  })
})
