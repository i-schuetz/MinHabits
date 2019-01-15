export enum Weekday {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export function toJSON(weekday: Weekday): number {
    switch(weekday) {
      case Weekday.Monday: return 0;
      case Weekday.Tuesday: return 1;
      case Weekday.Wednesday: return 2;
      case Weekday.Thursday: return 3;
      case Weekday.Friday: return 4;
      case Weekday.Saturday: return 5;
      case Weekday.Sunday: return 6;
    };
}

export function parse(json: number): Weekday {
  switch(json) {
    case 0: return Weekday.Monday;
    case 1: return Weekday.Tuesday;
    case 2: return Weekday.Wednesday;
    case 3: return Weekday.Thursday;
    case 4: return Weekday.Friday;
    case 5: return Weekday.Saturday;
    case 6: return Weekday.Sunday;
    default: throw new Error(`Invalid json: ${json}`)
  }
}
