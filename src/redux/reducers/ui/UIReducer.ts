import { combineReducers } from "redux"
import { DailyHabitsListState, dailyHabitsListReducer } from "./DailyHabitsListReducer"
import { StatsState, statsReducer } from "./StatsReducer"
import { settingsReducer, SettingsState } from "../../../redux/reducers/ui/SettingsReducer"
import { AppState, appReducer } from "./AppReducer"
import { EditHabitState, editHabitReducer } from "./EditHabitReducer"
import { ManageHabitsState, manageHabitsReducer } from "./ManageHabitsReducer"

export interface UIState {
  dailyHabitsList: DailyHabitsListState
  editHabit: EditHabitState
  stats: StatsState
  settings: SettingsState
  manageHabits: ManageHabitsState
  app: AppState // concerns whole window
}

export const uiReducer = combineReducers<UIState>({
  dailyHabitsList: dailyHabitsListReducer,
  editHabit: editHabitReducer,
  stats: statsReducer,
  settings: settingsReducer,
  manageHabits: manageHabitsReducer,
  app: appReducer,
})
