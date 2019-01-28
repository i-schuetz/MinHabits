import { Reducer, Action } from "redux"
import { action } from "typesafe-actions"
import Repo from "../../../Repo"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { ApplicationState } from "../RootReducer"
import { Habit } from "../../../models/Habit"
import { setModalOpenAction, SettingsScreenEntry } from "./SettingsReducer";
import { updateTasksForCurrentDate } from "./DailyHabitsListReducer";

export interface ManageHabitsState {
  readonly habits: Habit[]
}

export enum ManageHabitsActionTypes {
  GET_HABITS_SUCCESS = "@@ManageHabitsActionTypes/GET_HABITS_SUCCESS",
  DELETE_HABIT_SUCCESS = "@@ManageHabitsActionTypes/DELETE_HABIT_SUCCESS",
}

const initialState: ManageHabitsState = {
  habits: [],
}

export const retrieveHabitsSuccessAction = (habits: Habit[]) =>
  action(ManageHabitsActionTypes.GET_HABITS_SUCCESS, habits)

type ThunkResult<R> = ThunkAction<R, ApplicationState, undefined, Action>
export type DailyHabitsListThunkDispatch = ThunkDispatch<ApplicationState, undefined, Action>

export const exitAction = (): ThunkResult<{}> => dispatch => {
  dispatch(setModalOpenAction(SettingsScreenEntry.MANAGE_HABITS, false))
  return {}
}

export const getHabitsAction = (): ThunkResult<{}> => async dispatch => {
  const habits = await Repo.loadHabits()
  dispatch(retrieveHabitsSuccessAction(habits))
}

export const deleteHabitAction = (habit: Habit): ThunkResult<{}> => async dispatch => {
  await Repo.deleteHabits([habit])
  dispatch(action(ManageHabitsActionTypes.DELETE_HABIT_SUCCESS))
  dispatch(getHabitsAction())

  // Make the daily task list refresh
  // TODO (low prio) it doesn't seem right to trigger this from here, there could be a middleware instead 
  // (ideally in the DailyhabitsListReducer file) that
  // observes DELETE_HABIT_SUCCESS and dispatches it
  dispatch(updateTasksForCurrentDate())
}

export const manageHabitsReducer: Reducer<ManageHabitsState> = (state = initialState, action) => {
  switch (action.type) {
    case ManageHabitsActionTypes.GET_HABITS_SUCCESS:
      return { ...state, habits: action.payload }
    default:
      return state
  }
}
