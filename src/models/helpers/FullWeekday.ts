import { Weekday } from "../Weekday";

export type FullWeekday = {
  weekday: Weekday,
  name: string,
  shortName: string
}

export function array(): FullWeekday[] {
  return [
    { weekday: Weekday.Monday, name: "Monday", shortName: "M"},
    { weekday: Weekday.Tuesday, name: "Tuesday", shortName: "T"},
    { weekday: Weekday.Wednesday, name: "Wednesday", shortName: "W"},
    { weekday: Weekday.Thursday, name: "Thursday", shortName: "T"},
    { weekday: Weekday.Friday, name: "Friday", shortName: "F"},
    { weekday: Weekday.Saturday, name: "Saturday", shortName: "S"},
    { weekday: Weekday.Sunday, name: "Sunday", shortName: "S"}
  ]
}
