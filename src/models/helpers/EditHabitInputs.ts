import { DayDate } from "../DayDate"
import { TimeRuleValue } from "../TimeRuleValue"

export type EditHabitInputs = {
  id?: number
  name: string
  timeRuleValue: TimeRuleValue
  startDate: DayDate
  order?: number
}
