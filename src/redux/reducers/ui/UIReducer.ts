import { combineReducers } from "redux"
import { DailyHabitsListState, dailyHabitsListReducer } from './DailyHabitsListReducer';

export interface UIState {
  dailyHabitsList: DailyHabitsListState
}

export const uiReducer = combineReducers<UIState>({
  dailyHabitsList: dailyHabitsListReducer
})
