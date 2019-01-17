import { Reducer, Action } from "redux"
import { action } from "typesafe-actions"
import { Habit } from "../../../models/Habit"
import Repo from '../../../Repo';
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { DayDate } from "../../../models/DayDate";
import * as DayDateHelpers from "../../../models/DayDate";
import * as DateUtils from "../../../utils/DateUtils";
import * as GetHabitsForDate from "../../../logic/GetHabitsForDate";
import Preferences, { PreferencesKey } from '../../../Preferences';
import { Order } from "../../../models/helpers/Order";
import { EditHabitInputs } from "../../../models/helpers/EditHabitInputs";

export interface DailyHabitsListState {
  readonly editHabitModalOpen: boolean
  readonly editingHabit?: Habit
  readonly habits: Habit[]
  readonly selectDateModalOpen: boolean
  selectedDate?: DayDate
  title: String
}

export enum DailyHabitsListActionTypes {
  SET_EDITING_HABIT_EXISTING = "@@DailyHabitsListActions/SET_EDITING_HABIT_EXISTING",
  SET_EDITING_HABIT_NEW = "@@DailyHabitsListActions/SET_EDITING_HABIT_NEW",
  EXIT_EDITING_HABIT = "@@DailyHabitsListActions/EXIT_EDITING_HABIT",
  HABITS_FETCH_SUCCESS = "@@DailyHabitsListActions/HABITS_FETCH_SUCCESS",
  SUBMIT_HABIT_SUCCESS = "@@DailyHabitsListActions/SUBMIT_HABIT_SUCCESS",
  SET_SELECT_DATE_MODAL_OPEN = "@@DailyHabitsListActions/SET_SELECT_DATE_MODAL_OPEN",
  INIT_SELECTED_DATE = "@@DailyHabitsListActions/INIT_SELECTED_DATE",
  SET_SELECTED_DATE = "@@DailyHabitsListActions/SET_SELECTED_DATE",
}

const initialState: DailyHabitsListState = {
  editHabitModalOpen: false,
  editingHabit: undefined,
  habits: [],
  selectDateModalOpen: false,
  selectedDate: undefined,
  title: ""
}

export const setEditingHabitAction = (habit: Habit) =>
  action(DailyHabitsListActionTypes.SET_EDITING_HABIT_EXISTING, habit)
export const setSelectDateModalOpenAction = (open: boolean) =>
  action(DailyHabitsListActionTypes.SET_SELECT_DATE_MODAL_OPEN, open)
export const addNewHabitAction = () => action(DailyHabitsListActionTypes.SET_EDITING_HABIT_NEW)
export const exitEditingHabitAction = () => action(DailyHabitsListActionTypes.EXIT_EDITING_HABIT)
export const onFetchHabitsSuccessAction = (habits: Habit[]) => action(DailyHabitsListActionTypes.HABITS_FETCH_SUCCESS, habits)
export const onSubmitHabitSuccessAction = () => action(DailyHabitsListActionTypes.SUBMIT_HABIT_SUCCESS)
const setSelectedDateAction = (date: DayDate) => action(DailyHabitsListActionTypes.SET_SELECTED_DATE, date)

type ThunkResult<R> = ThunkAction<R, DailyHabitsListState, undefined, Action>;
export type DailyHabitsListThunkDispatch = ThunkDispatch<DailyHabitsListState, undefined, Action>;

const retrieveHabitsAction = (dayDate: DayDate): ThunkResult<{}> => async (dispatch) => {
  await Repo.init()
  const habits = await Repo.loadHabits()
  const filteredHabits = GetHabitsForDate.getHabitsForDate(dayDate, habits)
  dispatch(onFetchHabitsSuccessAction(filteredHabits))
};

export const submitHabitInputsAction = (inputs: EditHabitInputs): ThunkResult<{}> => async (dispatch, state) => {
  await Repo.addHabit(inputs)
  dispatch(onSubmitHabitSuccessAction())
  
  // Update in-memory habits
  const selectedDate = state().selectedDate
  if (selectedDate !== undefined) {
    dispatch(retrieveHabitsAction(selectedDate))
  }
};

/**
 * Inits selected date.
 * If there's a selection stored in preferences, uses it, otherwise uses today.
 */
export const initSelectedDateAction = (): ThunkResult<{}> => async (dispatch) => {
  const dayDateJSON: any = await Preferences.loadJSON(PreferencesKey.SELECTED_DAILY_LIST_DATE)
  const dayDate: DayDate | null = dayDateJSON !== null ? DayDateHelpers.parse(dayDateJSON) : null
  const selectedDayDate: DayDate = dayDate !== null ? dayDate : DateUtils.today()
  dispatch(setSelectedDateAction(selectedDayDate))
  dispatch(retrieveHabitsAction(selectedDayDate))
};

/**
 * Sets selected date in state, retrieves habits for it and closes select date modal.
 */
export const selectDateAction = (dayDate: DayDate): ThunkResult<{}> => async (dispatch) => {
  dispatch(setSelectedDateAction(dayDate))
  dispatch(retrieveHabitsAction(dayDate))
  dispatch(setSelectDateModalOpenAction(false))
};

function title(selectedDate: DayDate): string {
  if (selectedDate === undefined) { return "" }
  if (DayDateHelpers.compare(selectedDate, DateUtils.today()) === Order.EQ) {
    return "Today"
  }
  return DateUtils.formatDayDateWeekdayDayTextualMonth(selectedDate)
} 

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
    case DailyHabitsListActionTypes.SET_SELECT_DATE_MODAL_OPEN:
      return { ...state, selectDateModalOpen: action.payload }
    case DailyHabitsListActionTypes.SET_SELECTED_DATE:
      return { ...state, selectedDate: action.payload, title: title(action.payload) }
    default:
      return state
  }
}
