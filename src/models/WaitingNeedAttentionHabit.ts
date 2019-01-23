import { DayDate } from "./DayDate"
import * as DayDateHelpers from "./DayDate"

// TODO unit tests

export type WaitingNeedAttentionHabit = {
  readonly habitId: number
  readonly date: DayDate
}

export interface WaitingNeedAttentionHabitJSON {
  readonly habitId: number
  readonly date: string
}

export function toJSON(waitingHabit: WaitingNeedAttentionHabit): WaitingNeedAttentionHabitJSON {
  return {
    habitId: waitingHabit.habitId,
    date: DayDateHelpers.toJSON(waitingHabit.date)
  }
}

export function parse(json: WaitingNeedAttentionHabitJSON): WaitingNeedAttentionHabit {
  return {
    habitId: json.habitId,
    date: DayDateHelpers.parse(json.date)
  }
}
