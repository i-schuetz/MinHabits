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

export type HabitInputsValidationState = {
  readonly name: string[]
  readonly timeRule: string[]
  readonly startDate: string[]
}

const emptyValidationState = (): HabitInputsValidationState => {
  return {
    name: [],
    timeRule: [],
    startDate: [],
  }
}

type InputsValidationResult = InputsValidationResultSuccess | InputsValidationResultError

export interface InputsValidationResultSuccess {
  kind: "success"
  inputs: EditHabitInputs
}

export interface InputsValidationResultError {
  kind: "error"
  errors: HabitInputsValidationState // Just reuse the reducer's validation state holder. In this case it's expected to always contain at least one error.
}

type InputValidationResult<T> = InputValidationResultSuccess<T> | InputValidationResultError

export interface InputValidationResultSuccess<T> {
  kind: "success"
  input: T
  errors: string[]
}

export interface InputValidationResultError {
  kind: "error"
  errors: string[]
}

export interface EditHabitState {
  readonly editHabitModalOpen: boolean
  readonly editingHabit?: Habit
  readonly editTimeRuleModalOpen: boolean
  readonly inputs: EditHabitTemporaryInputs
  readonly editTimeRuleModalStep: EditTimeRuleModalStep
  readonly timeRuleOptionType?: TimeRuleOptionType
  readonly editTimeRuleModalBackButtonVisible: boolean
  readonly showingDeleteConfirmationPopup: boolean
  readonly validations: HabitInputsValidationState

  // If it was tried to submit already since the modal is open. Cleared when the modal is closed.
  // Used to determine if validation errors resulting of ongoing inputs should show.
  // (Until the user taps submit the first time, we don't want to see any errors and after that we want to update validation state on each update.)
  readonly triedToSubmitOnce: boolean
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
  SHOW_DELETE_CONFIRMATION = "@@EditHabitActionTypes/SHOW_DELETE_CONFIRMATION",
  DELETE_SUCCESS = "@@EditHabitActionTypes/DELETE_SUCCESS",
  SET_VALIDATION_STATE = "@@EditHabitActionTypes/SET_VALIDATION_STATE",
  TRY_SUBMIT_HABIT = "@@EditHabitActionTypes/TRY_SUBMIT_HABIT",

  // "In between step" to only close the confirmation modal - since if we try to do this and exit the edit modal at the same time,
  // it freezes. Letting DELETE_SUCCESS like it was - here we do set both the confirmation and edit modal to false.
  DELETE_SUCCESS_HACK = "@@EditHabitActionTypes/DELETE_SUCCESS_HACK",
}

const initialState: EditHabitState = {
  editHabitModalOpen: false,
  editingHabit: undefined,
  editTimeRuleModalOpen: false,
  inputs: { name: "", timeRuleValue: undefined, startDate: DateUtils.today() },
  editTimeRuleModalStep: EditTimeRuleModalStep.STEP1,
  timeRuleOptionType: undefined,
  editTimeRuleModalBackButtonVisible: false,
  showingDeleteConfirmationPopup: false,
  validations: emptyValidationState(),
  triedToSubmitOnce: false
}

// General
export const setEditingHabitAction = (habit: Habit) => action(EditHabitActionTypes.SET_EDITING_HABIT_EXISTING, habit)
export const addNewHabitAction = () => action(EditHabitActionTypes.SET_EDITING_HABIT_NEW)
export const exitEditingHabitAction = () => action(EditHabitActionTypes.EXIT_EDITING_HABIT)
export const onSubmitHabitSuccessAction = () => action(EditHabitActionTypes.SUBMIT_HABIT_SUCCESS)

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

// Delete
export const onDeleteSuccessAction = () => action(EditHabitActionTypes.DELETE_SUCCESS)
export const showDeleteConfirmationPopupAction = (show: boolean) =>
  action(EditHabitActionTypes.SHOW_DELETE_CONFIRMATION, show)

// Validation
export const setValidationStateAction = (validationState: HabitInputsValidationState) =>
  action(EditHabitActionTypes.SET_VALIDATION_STATE, validationState)

type ThunkResult<R> = ThunkAction<R, ApplicationState, undefined, Action>
export type EditHabitThunkDispatch = ThunkDispatch<ApplicationState, undefined, Action>

export const trySubmitHabitInputsAction = (): ThunkResult<{}> => async (dispatch, state) => {
  dispatch(action(EditHabitActionTypes.TRY_SUBMIT_HABIT))
  const validationResult = runValidationsInternal(state().ui.editHabit, dispatch)
  if (validationResult.kind == "success") {
      await Repo.upsertHabit(validationResult.inputs)
      dispatch(onSubmitHabitSuccessAction())
      dispatch(updateTasksForCurrentDate())
  }
}

export const setNameInputAction = (name: string): ThunkResult<{}> => async (dispatch, state) => {
  dispatch(action(EditHabitActionTypes.SET_NAME_INPUT, name))
  runValidationsOnInputs(state().ui.editHabit, dispatch)
}

export const setStartDateInputAction = (date: DayDate): ThunkResult<{}> => async (dispatch, state) => {
  dispatch(action(EditHabitActionTypes.SET_START_DATE_INPUT, date))
  runValidationsOnInputs(state().ui.editHabit, dispatch)
}

export const submitTimeRuleAction = (): ThunkResult<{}> => async (dispatch, state) => {
  dispatch(action(EditHabitActionTypes.SUBMIT_TIME_RULE))
  runValidationsOnInputs(state().ui.editHabit, dispatch)
}

const runValidationsOnInputs = (editingState: EditHabitState, dispatch: ThunkDispatch<{}, {}, Action<any>>) => {
  if (!editingState.triedToSubmitOnce) {
    return 
  }
  runValidationsInternal(editingState, dispatch)
}

/**
 * Runs input validations and sets state accordingly.
 * Shared helper for submission attempt and re-validating on changes after submission failed.
 */
const runValidationsInternal = (editingState: EditHabitState, dispatch: ThunkDispatch<{}, {}, Action<any>>): InputsValidationResult => {
  const habitIdMaybe = editingState.editingHabit === undefined ? undefined : editingState.editingHabit.id
  const validationResult = validate(editingState.inputs, habitIdMaybe)
  
  switch (validationResult.kind) {
    case "error":
      dispatch(setValidationStateAction(validationResult.errors))
      break
    case "success":
      dispatch(setValidationStateAction(emptyValidationState()))
      break
  }
  return validationResult
}

export const deleteHabitAction = (): ThunkResult<{}> => async (dispatch, state) => {
  const editingState = state().ui.editHabit
  const habitIdMaybe = editingState.editingHabit === undefined ? undefined : editingState.editingHabit.id
  if (habitIdMaybe === undefined) {
    console.error("There's no editing habit.")
    return
  }
  await Repo.deleteHabits([habitIdMaybe])
  dispatch(action(EditHabitActionTypes.DELETE_SUCCESS_HACK))
  setTimeout(() => {
    // Needs apparently a pause after closing the confirmation popup before closing edit modal, otherwise freeze
    dispatch(onDeleteSuccessAction())
    dispatch(updateTasksForCurrentDate())
  }, 500)
}

const validateName = (name: string | undefined): InputValidationResult<string> => {
  if (name === undefined || name === "") return { kind: "error", errors: ["Please enter a name"] }
  const maxChars = 50
  if (name.length > maxChars)
    return { kind: "error", errors: [`The name must not contain more than ${maxChars} characters.`] }
  return { kind: "success", input: name, errors: [] }
}

const validateTimeRule = (
  timeRuleValue: WeekdayTimeRuleValue | EachTimeRuleValue | undefined
): InputValidationResult<WeekdayTimeRuleValue | EachTimeRuleValue> => {
  if (timeRuleValue === undefined) return { kind: "error", errors: ["Please schedule your habit"] }
  return { kind: "success", input: timeRuleValue, errors: [] }
}

const validateStartDate = (date: DayDate | undefined): InputValidationResult<DayDate> => {
  if (date === undefined) return { kind: "error", errors: ["Please select a start date"] } // This should never happen, as a date should be preselected
  return { kind: "success", input: date, errors: [] }
}

// This is not the nicest block of code. Compiler safety was prioritized. There should be better ways to write this.
const validate = (tmpInputs: EditHabitTemporaryInputs, habitId: number | undefined): InputsValidationResult => {
  const nameResult = validateName(tmpInputs.name)
  const timeRuleResult = validateTimeRule(tmpInputs.timeRuleValue)
  const startDateResult = validateStartDate(tmpInputs.startDate)
  
  const toErrors = (): HabitInputsValidationState => {
    return {
      name: nameResult.errors,
      timeRule: timeRuleResult.errors,
      startDate: startDateResult.errors,
    }
  }

  switch (nameResult.kind) {
    case "success":
      switch (timeRuleResult.kind) {
        case "success":
          switch (startDateResult.kind) {
            case "success":
              const habit = {
                id: habitId,
                name: nameResult.input,
                timeRuleValue: timeRuleResult.input,
                startDate: startDateResult.input,
              }
              return { kind: "success", inputs: habit }
            case "error":
              return { kind: "error", errors: toErrors() }
          }
        case "error":
          return { kind: "error", errors: toErrors() }
      }
    case "error":
      return { kind: "error", errors: toErrors() }
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
    case EditHabitActionTypes.DELETE_SUCCESS:
      return {
        ...state,
        editingHabit: undefined,
        editHabitModalOpen: false,
        inputs: emptyTemporaryInputs(),
        editTimeRuleModalStep: EditTimeRuleModalStep.STEP1,
        showingDeleteConfirmationPopup: false,
        validations: emptyValidationState(),
        triedToSubmitOnce: false
      }
    case EditHabitActionTypes.DELETE_SUCCESS_HACK:
      return {
        ...state,
        showingDeleteConfirmationPopup: false,
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
    case EditHabitActionTypes.SHOW_DELETE_CONFIRMATION:
      return {
        ...state,
        showingDeleteConfirmationPopup: action.payload,
      }
    case EditHabitActionTypes.SET_VALIDATION_STATE:
      return {
        ...state,
        validations: action.payload,
      }
      case EditHabitActionTypes.TRY_SUBMIT_HABIT:
      return {
        ...state,
        triedToSubmitOnce: true,
      }
    default:
      return state
  }
}
