import { Reducer } from "redux"
import { action } from "typesafe-actions"

export interface DailyHabitsListState {
  readonly editHabitModalOpen: boolean
}

export enum DailyHabitsListActionTypes {
  SET_EDIT_HABIT_MODAL_OPEN = "@@DailyHabitsListActions/SET_EDIT_HABIT_MODAL_OPEN"
}

const initialState: DailyHabitsListState = {
  editHabitModalOpen: false
}

export const openEditHabitModalAction = (open: boolean) =>
  action(DailyHabitsListActionTypes.SET_EDIT_HABIT_MODAL_OPEN, open)

const dailyHabitsListReducer: Reducer<DailyHabitsListState> = (state = initialState, action) => {
  switch (action.type) {
    case DailyHabitsListActionTypes.SET_EDIT_HABIT_MODAL_OPEN: {
      return { ...state, editHabitModalOpen: action.payload }
    }
    default:
      return state
  }
}

export default dailyHabitsListReducer
