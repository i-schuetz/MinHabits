export enum TimeUnit {
  Day,
  Week,
  Month,
  Year
}

export function toJSON(timeUnit: TimeUnit): string {
  switch (timeUnit) {
    case TimeUnit.Day:
      return "d"
    case TimeUnit.Week:
      return "w"
    case TimeUnit.Month:
      return "m"
    case TimeUnit.Year:
      return "y"
  }
}

export function parse(str: string): TimeUnit {
  switch (str) {
    case "d":
      return TimeUnit.Day
    case "w":
      return TimeUnit.Week
    case "m":
      return TimeUnit.Month
    case "y":
      return TimeUnit.Year
    default:
      throw new Error(`Invalid time unit type: ${str}`)
  }
}
