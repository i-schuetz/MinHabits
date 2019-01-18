import { combineReducers } from "redux"
import { DailyHabitsListState, dailyHabitsListReducer } from './DailyHabitsListReducer';
import { StatsState, statsReducer } from './StatsReducer';
import { settingsReducer, SettingsState } from '../../../redux/reducers/ui/SettingsReducer';

export interface UIState {
  dailyHabitsList: DailyHabitsListState,
  stats: StatsState,
  settings: SettingsState,
}

export const uiReducer = combineReducers<UIState>({
  dailyHabitsList: dailyHabitsListReducer,
  stats: statsReducer,
  settings: settingsReducer
})
