import { combineReducers } from "redux"
import { DailyHabitsListState, dailyHabitsListReducer } from './DailyHabitsListReducer';
import { StatsState, statsReducer } from './StatsReducer';
import { settingsReducer, SettingsState } from '../../../redux/reducers/ui/SettingsReducer';
import { AppState, appReducer } from './AppReducer';

export interface UIState {
  dailyHabitsList: DailyHabitsListState,
  stats: StatsState,
  settings: SettingsState,
  app: AppState // concerning whole window
}

export const uiReducer = combineReducers<UIState>({
  dailyHabitsList: dailyHabitsListReducer,
  stats: statsReducer,
  settings: settingsReducer,
  app: appReducer
})
