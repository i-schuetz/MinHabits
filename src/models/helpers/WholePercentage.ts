import * as MathUtils from "../../utils/MathUtils"

/**
 * A percentage number with 3 digits. This means the range is 0-999%
 */
export type WholePercentage = {
  digit1: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  digit2: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  digit3: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
}

export function toString(wholePercentage: WholePercentage): string {
  const part1 = wholePercentage.digit1 == 0 ? "" : wholePercentage.digit1
  const part2 = wholePercentage.digit1 == 0 && wholePercentage.digit2 == 0 ? "" : wholePercentage.digit2
  return `${part1}${part2}${wholePercentage.digit3}`
}

export function toNumber(wholePercentage: WholePercentage): number {
  return parseInt(toString(wholePercentage))
}

export function toDecimalNumber(wholePercentage: WholePercentage): number {
  return toNumber(wholePercentage) / 100
}

/**
 * Converts percentage fraction into 3 digits percentage.
 * 0.1 -> 10%
 * 1 -> 100%
 * 5 -> 500%
 * 10 -> 1000% throws error, since it's 4 digits.
 * @param percentage percentage as decimal. Must be positive.
 */
export function toWholePercentage(decimalPercentage: number): WholePercentage {
  if (isNaN(decimalPercentage)) {
    throw Error("Percentage can't be NaN")
  }
  if (decimalPercentage >= 10) {
    // 4 Digits - error
    throw Error("Percentage can't be bigger than 1")
  }

  const multiplied = decimalPercentage * 100
  const digitsCount = MathUtils.getDigitCount(multiplied)
  return {
    digit1: digitsCount < 2 ? 0 : MathUtils.getDigit(multiplied, digitsCount - 3),
    digit2: digitsCount < 1 ? 0 : MathUtils.getDigit(multiplied, digitsCount - 2),
    digit3: MathUtils.getDigit(multiplied, digitsCount - 1)
  }
}
