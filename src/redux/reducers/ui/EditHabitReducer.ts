import { Reducer, Action } from "redux"
import { action } from "typesafe-actions"
import { Habit } from "../../../models/Habit"
import Repo from "../../../Repo"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { EditHabitInputs } from "../../../models/helpers/EditHabitInputs"
import { updateTasksForCurrentDate } from "./DailyHabitsListReducer";
import { ApplicationState } from '../RootReducer';

export interface EditHabitState {
  readonly editHabitModalOpen: boolean
  readonly editingHabit?: Habit
}

export enum EditHabitActionTypes {
  SET_EDITING_HABIT_EXISTING = "@@EditHabitActionTypes/SET_EDITING_HABIT_EXISTING",
  SET_EDITING_HABIT_NEW = "@@EditHabitActionTypes/SET_EDITING_HABIT_NEW",
  EXIT_EDITING_HABIT = "@@EditHabitActionTypes/EXIT_EDITING_HABIT",
  SUBMIT_HABIT_SUCCESS = "@@EditHabitActionTypes/SUBMIT_HABIT_SUCCESS",
}

const initialState: EditHabitState = {
  editHabitModalOpen: false,
  editingHabit: undefined,
}

export const setEditingHabitAction = (habit: Habit) =>
  action(EditHabitActionTypes.SET_EDITING_HABIT_EXISTING, habit)
export const addNewHabitAction = () => action(EditHabitActionTypes.SET_EDITING_HABIT_NEW)
export const exitEditingHabitAction = () => action(EditHabitActionTypes.EXIT_EDITING_HABIT)
export const onSubmitHabitSuccessAction = () => action(EditHabitActionTypes.SUBMIT_HABIT_SUCCESS)

type ThunkResult<R> = ThunkAction<R, ApplicationState, undefined, Action>
export type EditHabitThunkDispatch = ThunkDispatch<ApplicationState, undefined, Action>

export const submitHabitInputsAction = (inputs: EditHabitInputs): ThunkResult<{}> => async (dispatch, state) => {
  await Repo.addHabit(inputs)
  dispatch(onSubmitHabitSuccessAction())
  dispatch(updateTasksForCurrentDate())
}

export const editHabitReducer: Reducer<EditHabitState> = (state = initialState, action) => {
  switch (action.type) {
    case EditHabitActionTypes.SET_EDITING_HABIT_NEW:
      return { ...state, editingHabit: undefined, editHabitModalOpen: true }
    case EditHabitActionTypes.SET_EDITING_HABIT_EXISTING: {
      return { ...state, editingHabit: action.payload, editHabitModalOpen: true }
    }
    case EditHabitActionTypes.EXIT_EDITING_HABIT:
      return { ...state, editingHabit: undefined, editHabitModalOpen: false }
    case EditHabitActionTypes.SUBMIT_HABIT_SUCCESS:
      return { ...state, editingHabit: undefined, editHabitModalOpen: false }
    default:
      return state
  }
}
