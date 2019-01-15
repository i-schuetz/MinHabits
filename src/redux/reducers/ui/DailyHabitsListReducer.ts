import { Reducer, Action } from "redux"
import { action } from "typesafe-actions"
import { Habit } from "../../../models/Habit"
import Repo from '../../../Repo';
import { ThunkAction, ThunkDispatch } from "redux-thunk";

export interface DailyHabitsListState {
  readonly editHabitModalOpen: boolean
  readonly editingHabit?: Habit
  readonly habits: Habit[]
}

export enum DailyHabitsListActionTypes {
  SET_EDITING_HABIT_EXISTING = "@@DailyHabitsListActions/SET_EDITING_HABIT_EXISTING",
  SET_EDITING_HABIT_NEW = "@@DailyHabitsListActions/SET_EDITING_HABIT_NEW",
  EXIT_EDITING_HABIT = "@@DailyHabitsListActions/EXIT_EDITING_HABIT",
  HABITS_FETCH_SUCCESS = "@@DailyHabitsListActions/HABITS_FETCH_SUCCESS",
  SUBMIT_HABIT_SUCCESS = "@@DailyHabitsListActions/SUBMIT_HABIT_SUCCESS"
}

const initialState: DailyHabitsListState = {
  editHabitModalOpen: false,
  editingHabit: undefined,
  habits: []
}

export const setEditingHabitAction = (habit: Habit) =>
  action(DailyHabitsListActionTypes.SET_EDITING_HABIT_EXISTING, habit)
export const addNewHabitAction = () => action(DailyHabitsListActionTypes.SET_EDITING_HABIT_NEW)
export const exitEditingHabitAction = () => action(DailyHabitsListActionTypes.EXIT_EDITING_HABIT)
export const onFetchHabitsSuccessAction = (habits: Habit[]) => action(DailyHabitsListActionTypes.HABITS_FETCH_SUCCESS, habits)
export const onSubmitHabitSuccessAction = () => action(DailyHabitsListActionTypes.SUBMIT_HABIT_SUCCESS)

type MyThunkResult<R> = ThunkAction<R, DailyHabitsListState, undefined, Action>;
export type MyThunkDispatch = ThunkDispatch<DailyHabitsListState, undefined, Action>;

export const retrieveHabitsAction = (): MyThunkResult<{}> => async (dispatch) => {
  await Repo.init()
  const habits = await Repo.loadItems()
  dispatch(onFetchHabitsSuccessAction(habits))
};

export const submitHabitAction = (habit: Habit): MyThunkResult<{}> => async (dispatch) => {
  await Repo.addHabit(habit)
  dispatch(onSubmitHabitSuccessAction())
  dispatch(retrieveHabitsAction())
};

export const dailyHabitsListReducer: Reducer<DailyHabitsListState> = (state = initialState, action) => {
  switch (action.type) {
    case DailyHabitsListActionTypes.SET_EDITING_HABIT_NEW:
      return { ...state, editingHabit: undefined, editHabitModalOpen: true }
    case DailyHabitsListActionTypes.SET_EDITING_HABIT_EXISTING: {
      return { ...state, editingHabit: action.payload, editHabitModalOpen: true }
    }
    case DailyHabitsListActionTypes.EXIT_EDITING_HABIT:
      return { ...state, editingHabit: undefined, editHabitModalOpen: false }
    case DailyHabitsListActionTypes.HABITS_FETCH_SUCCESS:
      return { ...state, habits: action.payload }
    case DailyHabitsListActionTypes.SUBMIT_HABIT_SUCCESS:
      return { ...state, editingHabit: undefined, editHabitModalOpen: false }
    default:
      return state
  }
}
