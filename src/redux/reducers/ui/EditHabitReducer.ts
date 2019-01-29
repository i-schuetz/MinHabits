import { Reducer, Action } from "redux"
import { action } from "typesafe-actions"
import { Habit } from "../../../models/Habit"
import Repo from "../../../Repo"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { EditHabitInputs } from "../../../models/helpers/EditHabitInputs"
import { updateTasksForCurrentDate } from "./DailyHabitsListReducer"
import { ApplicationState } from "../RootReducer"
import { DayDate } from "../../../models/DayDate"
import { TimeRuleValue, EachTimeRuleValue, WeekdayTimeRuleValue } from "../../../models/TimeRuleValue"
import * as DateUtils from "../../../utils/DateUtils"

export enum EditTimeRuleModalStep {
  STEP1,
  STEP2,
}

export enum TimeRuleOptionType {
  WEEKDAY,
  EACH,
}

export interface EditHabitState {
  readonly editHabitModalOpen: boolean
  readonly editingHabit?: Habit
  readonly editTimeRuleModalOpen: boolean
  readonly inputs: EditHabitTemporaryInputs
  readonly editTimeRuleModalStep: EditTimeRuleModalStep
  readonly timeRuleOptionType?: TimeRuleOptionType
  readonly editTimeRuleModalBackButtonVisible: boolean
}

export type EditHabitTemporaryInputs = {
  name?: string
  timeRuleValue?: TimeRuleValue
  timeRuleValueInTimeRulePopup?: TimeRuleValue // this is alive only while time rule popup is open
  startDate: DayDate
}

export enum EditHabitActionTypes {
  SET_EDITING_HABIT_EXISTING = "@@EditHabitActionTypes/SET_EDITING_HABIT_EXISTING",
  SET_EDITING_HABIT_NEW = "@@EditHabitActionTypes/SET_EDITING_HABIT_NEW",
  EXIT_EDITING_HABIT = "@@EditHabitActionTypes/EXIT_EDITING_HABIT",
  SUBMIT_HABIT_SUCCESS = "@@EditHabitActionTypes/SUBMIT_HABIT_SUCCESS",
  SET_NAME_INPUT = "@@EditHabitActionTypes/SET_NAME_INPUT",
  SET_START_DATE_INPUT = "@@EditHabitActionTypes/SET_START_DATE_INPUT",
  SET_TIME_RULE_MODAL_OPEN = "@@EditHabitActionTypes/SET_TIME_RULE_MODAL_OPEN",
  SET_TIME_RULE_MODAL_STEP = "@@EditHabitActionTypes/SET_TIME_RULE_MODAL_STEP",
  SET_TIME_RULE_OPTION_TYPE = "@@EditHabitActionTypes/SET_TIME_RULE_OPTION_TYPE",
  SET_WEEKDAYS_TIME_RULE = "@@EditHabitActionTypes/SET_WEEKDAYS_TIME_RULE",
  SET_EACH_TIME_RULE = "@@EditHabitActionTypes/SET_EACH_TIME_RULE",
  SUBMIT_TIME_RULE = "@@EditHabitActionTypes/SUBMIT_TIME_RULE",
}

const initialState: EditHabitState = {
  editHabitModalOpen: false,
  editingHabit: undefined,
  editTimeRuleModalOpen: false,
  inputs: { name: "", timeRuleValue: undefined, startDate: DateUtils.today() },
  editTimeRuleModalStep: EditTimeRuleModalStep.STEP1,
  timeRuleOptionType: undefined,
  editTimeRuleModalBackButtonVisible: false,
}

// General
export const setEditingHabitAction = (habit: Habit) => action(EditHabitActionTypes.SET_EDITING_HABIT_EXISTING, habit)
export const addNewHabitAction = () => action(EditHabitActionTypes.SET_EDITING_HABIT_NEW)
export const exitEditingHabitAction = () => action(EditHabitActionTypes.EXIT_EDITING_HABIT)
export const onSubmitHabitSuccessAction = () => action(EditHabitActionTypes.SUBMIT_HABIT_SUCCESS)

// Inputs
export const setNameInputAction = (name: string) => action(EditHabitActionTypes.SET_NAME_INPUT, name)
export const setStartDateInputAction = (date: DayDate) => action(EditHabitActionTypes.SET_START_DATE_INPUT, date)

// Inputs - Time rule
export const setTimeRuleModalOpenAction = (open: boolean) => action(EditHabitActionTypes.SET_TIME_RULE_MODAL_OPEN, open)
export const setTimeRuleModalStepAction = (step: EditTimeRuleModalStep) =>
  action(EditHabitActionTypes.SET_TIME_RULE_MODAL_STEP, step)
export const setTimeRuleOptionTypeAction = (optionType: TimeRuleOptionType) =>
  action(EditHabitActionTypes.SET_TIME_RULE_OPTION_TYPE, optionType)
export const setWeekdaysTimeRuleAction = (value: WeekdayTimeRuleValue) =>
  action(EditHabitActionTypes.SET_WEEKDAYS_TIME_RULE, value)
export const setEachTimeRuleAction = (value: EachTimeRuleValue) =>
  action(EditHabitActionTypes.SET_EACH_TIME_RULE, value)
export const submitTimeRuleAction = () => action(EditHabitActionTypes.SUBMIT_TIME_RULE)

type ThunkResult<R> = ThunkAction<R, ApplicationState, undefined, Action>
export type EditHabitThunkDispatch = ThunkDispatch<ApplicationState, undefined, Action>

export const trySubmitHabitInputsAction = (): ThunkResult<{}> => async (dispatch, state) => {
  const editingState = state().ui.editHabit
  const habitIdMaybe = editingState.editingHabit === undefined ? undefined : editingState.editingHabit.id
  const inputs = toInputs(editingState.inputs, habitIdMaybe)
  if (inputs !== null) {
    await Repo.upsertHabit(inputs)
    dispatch(onSubmitHabitSuccessAction())
    dispatch(updateTasksForCurrentDate())
  }
}

const toInputs = (tmpInputs: EditHabitTemporaryInputs, habitId: number | undefined): EditHabitInputs | null => {
  if (!tmpInputs.name || !tmpInputs.timeRuleValue || !tmpInputs.startDate) {
    console.log("Input validation failed: " + JSON.stringify(tmpInputs))
    return null
  }
  return {
    id: habitId,
    name: tmpInputs.name,
    timeRuleValue: tmpInputs.timeRuleValue,
    startDate: tmpInputs.startDate,
  }
}

const emptyTemporaryInputs = (): EditHabitTemporaryInputs => {
  return {
    name: "",
    timeRuleValue: undefined,
    startDate: DateUtils.today(),
  }
}

const toTemporaryInputs = (habit: Habit): EditHabitTemporaryInputs => {
  return {
    name: habit.name,
    timeRuleValue: habit.time.value,
    startDate: habit.time.start,
  }
}

export const editHabitReducer: Reducer<EditHabitState> = (state = initialState, action) => {
  switch (action.type) {
    case EditHabitActionTypes.SET_EDITING_HABIT_NEW:
      return {
        ...state,
        editingHabit: undefined,
        editHabitModalOpen: true,
        inputs: emptyTemporaryInputs(),
      }

    case EditHabitActionTypes.SET_EDITING_HABIT_EXISTING: {
      const habit: Habit = action.payload
      return {
        ...state,
        editingHabit: habit,
        editHabitModalOpen: true,
        inputs: toTemporaryInputs(habit),
      }
    }
    case EditHabitActionTypes.EXIT_EDITING_HABIT:
    case EditHabitActionTypes.SUBMIT_HABIT_SUCCESS:
      return {
        ...state,
        editingHabit: undefined,
        editHabitModalOpen: false,
        inputs: emptyTemporaryInputs(),
        editTimeRuleModalStep: EditTimeRuleModalStep.STEP1,
      }
    case EditHabitActionTypes.SET_NAME_INPUT:
      return { ...state, inputs: { ...state.inputs, name: action.payload } }
    case EditHabitActionTypes.SET_START_DATE_INPUT:
      return { ...state, inputs: { ...state.inputs, startDate: action.payload } }
    case EditHabitActionTypes.SET_TIME_RULE_MODAL_OPEN:
      const open: boolean = action.payload
      if (open) {
        return { ...state, editTimeRuleModalOpen: open }
      } else {
        // User explicitly exits the time rule modal (not via submitting)
        return {
          ...state,
          editTimeRuleModalOpen: open,
          editTimeRuleModalStep: EditTimeRuleModalStep.STEP1,
          inputs: { ...state.inputs, timeRuleValueInTimeRulePopup: undefined }, // Clear time rule inputs
        }
      }
    case EditHabitActionTypes.SET_TIME_RULE_MODAL_STEP:
      const step: EditTimeRuleModalStep = action.payload
      return {
        ...state,
        editTimeRuleModalStep: step,
        editTimeRuleModalBackButtonVisible: step != EditTimeRuleModalStep.STEP1,
      }
    case EditHabitActionTypes.SET_TIME_RULE_OPTION_TYPE:
      return { ...state, timeRuleOptionType: action.payload }
    case EditHabitActionTypes.SET_WEEKDAYS_TIME_RULE:
      return {
        ...state,
        inputs: { ...state.inputs, timeRuleValueInTimeRulePopup: action.payload },
      }
    case EditHabitActionTypes.SET_EACH_TIME_RULE:
      return {
        ...state,
        inputs: { ...state.inputs, timeRuleValueInTimeRulePopup: action.payload },
      }
    case EditHabitActionTypes.SUBMIT_TIME_RULE:
      return {
        ...state,
        editTimeRuleModalOpen: false,
        editTimeRuleModalStep: EditTimeRuleModalStep.STEP1,
        inputs: {
          ...state.inputs,
          timeRuleValue: state.inputs.timeRuleValueInTimeRulePopup,
          timeRuleValueInTimeRulePopup: undefined,
        },
      }
    default:
      return state
  }
}
