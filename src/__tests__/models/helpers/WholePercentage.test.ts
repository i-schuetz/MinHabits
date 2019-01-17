import { WholePercentage } from "../../../models/helpers/WholePercentage"
import * as WholePercentageHelpers from "../../../models/helpers/WholePercentage"

describe("WholePercentage", () => {
  it("Converts number to whole percentage", () => {
    expect(WholePercentageHelpers.toWholePercentage(0)).toEqual({ digit1: 0, digit2: 0, digit3: 0 } as WholePercentage)
    expect(WholePercentageHelpers.toWholePercentage(0.0)).toEqual({
      digit1: 0,
      digit2: 0,
      digit3: 0
    } as WholePercentage)
    expect(WholePercentageHelpers.toWholePercentage(0.1)).toEqual({
      digit1: 0,
      digit2: 1,
      digit3: 0
    } as WholePercentage)
    expect(WholePercentageHelpers.toWholePercentage(0.25)).toEqual({
      digit1: 0,
      digit2: 2,
      digit3: 5
    } as WholePercentage)
    expect(WholePercentageHelpers.toWholePercentage(0.523)).toEqual({
      digit1: 0,
      digit2: 5,
      digit3: 2
    } as WholePercentage)
    expect(WholePercentageHelpers.toWholePercentage(0.599)).toEqual({
      digit1: 0,
      digit2: 5,
      digit3: 9
    } as WholePercentage)
    expect(WholePercentageHelpers.toWholePercentage(0.101)).toEqual({
      digit1: 0,
      digit2: 1,
      digit3: 0
    } as WholePercentage)

    expect(WholePercentageHelpers.toWholePercentage(1)).toEqual({ digit1: 1, digit2: 0, digit3: 0 } as WholePercentage)
    expect(WholePercentageHelpers.toWholePercentage(2.534)).toEqual({
      digit1: 2,
      digit2: 5,
      digit3: 3
    } as WholePercentage)
    expect(WholePercentageHelpers.toWholePercentage(9.99999999)).toEqual({
      digit1: 9,
      digit2: 9,
      digit3: 9
    } as WholePercentage)

    expect(() => WholePercentageHelpers.toWholePercentage(10)).toThrow()
    expect(() => WholePercentageHelpers.toWholePercentage(10.01)).toThrow()
    expect(() => WholePercentageHelpers.toWholePercentage(10.2)).toThrow()
    expect(() => WholePercentageHelpers.toWholePercentage(11)).toThrow()
    expect(() => WholePercentageHelpers.toWholePercentage(1234)).toThrow()
    expect(() => WholePercentageHelpers.toWholePercentage(1234.534523424)).toThrow()
    expect(() => WholePercentageHelpers.toWholePercentage(1000000)).toThrow()
    expect(() => WholePercentageHelpers.toWholePercentage(-0.1)).toThrow()
    expect(() => WholePercentageHelpers.toWholePercentage(-1)).toThrow()
    expect(() => WholePercentageHelpers.toWholePercentage(-1234.534523424)).toThrow()
    expect(() => WholePercentageHelpers.toWholePercentage(NaN)).toThrow()
  })

  it("Converts whole percentage to number", () => {
    expect(WholePercentageHelpers.toNumber({ digit1: 0, digit2: 0, digit3: 0 })).toEqual(0)
    expect(WholePercentageHelpers.toNumber({ digit1: 0, digit2: 1, digit3: 0 })).toEqual(10)
    expect(WholePercentageHelpers.toNumber({ digit1: 1, digit2: 0, digit3: 0 })).toEqual(100)
    expect(WholePercentageHelpers.toNumber({ digit1: 0, digit2: 0, digit3: 7 })).toEqual(7)
    expect(WholePercentageHelpers.toNumber({ digit1: 0, digit2: 5, digit3: 4 })).toEqual(54)
    expect(WholePercentageHelpers.toNumber({ digit1: 9, digit2: 9, digit3: 9 })).toEqual(999)
  })

  it("Converts whole percentage to fraction number", () => {
    expect(WholePercentageHelpers.toDecimalNumber({ digit1: 0, digit2: 0, digit3: 0 })).toEqual(0)
    expect(WholePercentageHelpers.toDecimalNumber({ digit1: 0, digit2: 1, digit3: 0 })).toEqual(0.1)
    expect(WholePercentageHelpers.toDecimalNumber({ digit1: 1, digit2: 0, digit3: 0 })).toEqual(1)
    expect(WholePercentageHelpers.toDecimalNumber({ digit1: 0, digit2: 0, digit3: 7 })).toEqual(0.07)
    expect(WholePercentageHelpers.toDecimalNumber({ digit1: 0, digit2: 5, digit3: 4 })).toEqual(0.54)
    expect(WholePercentageHelpers.toDecimalNumber({ digit1: 9, digit2: 9, digit3: 9 })).toEqual(9.99)
  })
})
