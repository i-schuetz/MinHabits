import { combineReducers } from "redux"
import { DailyHabitsListState, dailyHabitsListReducer } from './DailyHabitsListReducer';
import { StatsState, statsReducer } from './StatsReducer';

export interface UIState {
  dailyHabitsList: DailyHabitsListState,
  stats: StatsState
}

export const uiReducer = combineReducers<UIState>({
  dailyHabitsList: dailyHabitsListReducer,
  stats: statsReducer,
})
