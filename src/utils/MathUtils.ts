/**
 * Gets digit from number at index.
 * Throws and error if index is larger than digit count or if number is negative.
 * Decimals are ignored. Querying digit at decimal place will throw an error.
 */
export function getDigit(number: number, index: number): 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 {
  if (isNaN(number) || isNaN(index)) {
    throw Error(`Number: ${number} or index: ${index} is NaN`)
  }

  const digitCount = getDigitCount(number)
  if (index >= digitCount) {
    throw Error(`Index: ${index} out of bounds of number: ${number} with digit count: ${digitCount}`)
  }
  const val = Math.floor((number / Math.pow(10, digitCount - index - 1)) % 10)

  switch (Math.trunc(val)) {
    case 0:
      return 0
    case 1:
      return 1
    case 2:
      return 2
    case 3:
      return 3
    case 4:
      return 4
    case 5:
      return 5
    case 6:
      return 6
    case 7:
      return 7
    case 8:
      return 8
    case 9:
      return 9
    default:
      throw Error(`Invalid digit number: ${val}`)
  }
}

/**
 * https://stackoverflow.com/a/41712226/930450
 * Note: Decimals are ignored.
 */
export function getDigitCount(number: number): number {
  if (isNaN(number)) {
    throw Error(`Number: ${number} is NaN`)
  }
  return Math.max(Math.floor(Math.log10(Math.abs(number))), 0) + 1
}
