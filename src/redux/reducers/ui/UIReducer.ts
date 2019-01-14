import { combineReducers } from "redux"
import dailyHabitsListReducer from "./DailyHabitsListReducer"
import { DailyHabitsListState } from './DailyHabitsListReducer';

export interface UIState {
  dailyHabitsList: DailyHabitsListState
}

export const uiReducer = combineReducers<UIState>({
  dailyHabitsList: dailyHabitsListReducer
})
