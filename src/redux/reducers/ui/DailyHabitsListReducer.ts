import { Reducer } from "redux"
import { action } from "typesafe-actions"
import { Habit } from "../../../models/Habit"

export interface DailyHabitsListState {
  readonly editHabitModalOpen: boolean
  readonly editingHabit?: Habit
}

export enum DailyHabitsListActionTypes {
  SET_EDITING_HABIT_EXISTING = "@@DailyHabitsListActions/SET_EDITING_HABIT_EXISTING",
  SET_EDITING_HABIT_NEW = "@@DailyHabitsListActions/SET_EDITING_HABIT_NEW",
  EXIT_EDITING_HABIT = "@@DailyHabitsListActions/EXIT_EDITING_HABIT"
}

const initialState: DailyHabitsListState = {
  editHabitModalOpen: false,
  editingHabit: undefined
}

export const setEditingHabitAction = (habit: Habit) =>
  action(DailyHabitsListActionTypes.SET_EDITING_HABIT_EXISTING, habit)
export const addNewHabitAction = () => action(DailyHabitsListActionTypes.SET_EDITING_HABIT_NEW)
export const exitEditingHabitAction = () => action(DailyHabitsListActionTypes.EXIT_EDITING_HABIT)

export const dailyHabitsListReducer: Reducer<DailyHabitsListState> = (state = initialState, action) => {
  switch (action.type) {
    case DailyHabitsListActionTypes.SET_EDITING_HABIT_NEW:
      return { ...state, editingHabit: undefined, editHabitModalOpen: true }
    case DailyHabitsListActionTypes.SET_EDITING_HABIT_EXISTING: {
      const editingHabit: Habit = action.payload
      return { ...state, editingHabit: editingHabit, editHabitModalOpen: true }
    }
    case DailyHabitsListActionTypes.EXIT_EDITING_HABIT:
      return { ...state, editingHabit: undefined, editHabitModalOpen: false }
    default:
      return state
  }
}
