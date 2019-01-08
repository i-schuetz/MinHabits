export enum Month {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

export namespace Month {

  export function toJSON(month: Month): string {
    return `${toNumber(month)}`
  }

  export function parse(string: string): Month {
    return parseNumber(parseInt(string));
  }

  export function parseNumber(number: number): Month {
    switch (number) {
      case 0: return Month.January;
      case 1: return Month.February;
      case 2: return Month.March;
      case 3: return Month.April;
      case 4: return Month.May;
      case 5: return Month.June;
      case 6: return Month.July;
      case 7: return Month.August;
      case 8: return Month.September;
      case 9: return Month.October;
      case 10: return Month.November;
      case 11: return Month.December;
      default: throw new Error(`Invalid month number: ${number}`)
    }
  }

  function toNumber(month: Month): number {
    switch (month) {
      case Month.January: return 0;
      case Month.February: return 1;
      case Month.March: return 2;
      case Month.April: return 3;
      case Month.May: return 4;
      case Month.June: return 5;
      case Month.July: return 6;
      case Month.August: return 7;
      case Month.September: return 8;
      case Month.October: return 9;
      case Month.November: return 10;
      case Month.December: return 11;
    }
  }
}
