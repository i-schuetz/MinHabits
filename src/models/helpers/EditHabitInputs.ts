import { DayDate } from "../DayDate"
import { TimeRuleValue } from "../TimeRuleValue"

export type EditHabitInputs = {
  name: string
  timeRuleValue: TimeRuleValue
  startDate: DayDate
}
