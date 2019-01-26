import { Weekday } from "../Weekday";
import { TimeUnit } from "../TimeUnit";

export type FullTimeUnit = {
  unit: TimeUnit,
  nameSingular: string,
  namePlural: string,
}

export function array(): FullTimeUnit[] {
  return [
    { unit: TimeUnit.Day, nameSingular: "Day", namePlural: "Days"},
    { unit: TimeUnit.Week, nameSingular: "Week", namePlural: "Weeks"},
    { unit: TimeUnit.Month, nameSingular: "Month", namePlural: "Months"},
    { unit: TimeUnit.Year, nameSingular: "Year", namePlural: "Years"},
  ]
}
