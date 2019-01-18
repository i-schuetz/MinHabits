import { Reducer, Action } from "redux"
import { action } from "typesafe-actions"
import { Habit } from "../../../models/Habit"
import Repo from "../../../Repo"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { DayDate } from "../../../models/DayDate"
import * as DayDateHelpers from "../../../models/DayDate"
import * as DateUtils from "../../../utils/DateUtils"
import Preferences, { PreferencesKey } from "../../../Preferences"
import { Order } from "../../../models/helpers/Order"
import { EditHabitInputs } from "../../../models/helpers/EditHabitInputs"
import { generateTasksForPresentOrFuture, generateTasksForPast } from "../../../logic/GenerateTasksForDate"
import { Task, TaskDoneStatus } from "../../../models/helpers/Task"
import * as TaskHelpers from "../../../models/helpers/Task";

export interface DailyHabitsListState {
  readonly editHabitModalOpen: boolean
  readonly editingHabit?: Habit
  readonly tasks: Task[]
  readonly selectDateModalOpen: boolean
  selectedDate?: DayDate
  title: String
}

export enum DailyHabitsListActionTypes {
  SET_EDITING_HABIT_EXISTING = "@@DailyHabitsListActions/SET_EDITING_HABIT_EXISTING",
  SET_EDITING_HABIT_NEW = "@@DailyHabitsListActions/SET_EDITING_HABIT_NEW",
  EXIT_EDITING_HABIT = "@@DailyHabitsListActions/EXIT_EDITING_HABIT",
  TASKS_GENERATE_SUCCESS = "@@DailyHabitsListActions/TASKS_GENERATE_SUCCESS",
  SUBMIT_HABIT_SUCCESS = "@@DailyHabitsListActions/SUBMIT_HABIT_SUCCESS",
  SET_SELECT_DATE_MODAL_OPEN = "@@DailyHabitsListActions/SET_SELECT_DATE_MODAL_OPEN",
  INIT_SELECTED_DATE = "@@DailyHabitsListActions/INIT_SELECTED_DATE",
  SET_SELECTED_DATE = "@@DailyHabitsListActions/SET_SELECTED_DATE",
  SET_TASK_DONE = "@@DailyHabitsListActions/SET_TASK_DONE",
}

const initialState: DailyHabitsListState = {
  editHabitModalOpen: false,
  editingHabit: undefined,
  tasks: [],
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
export const onGenerateTasksSuccessAction = (tasks: Task[]) =>
  action(DailyHabitsListActionTypes.TASKS_GENERATE_SUCCESS, tasks)
export const onSubmitHabitSuccessAction = () => action(DailyHabitsListActionTypes.SUBMIT_HABIT_SUCCESS)
const setSelectedDateAction = (date: DayDate) => action(DailyHabitsListActionTypes.SET_SELECTED_DATE, date)

type ThunkResult<R> = ThunkAction<R, DailyHabitsListState, undefined, Action>
export type DailyHabitsListThunkDispatch = ThunkDispatch<DailyHabitsListState, undefined, Action>

const generateTasks: (dayDate: DayDate) => Promise<Task[]> = async (dayDate: DayDate) => {
  const resolvedTasks = await Repo.loadResolvedTasksWithHabits(dayDate)
  if (DateUtils.isPast(dayDate)) {
    return generateTasksForPast(dayDate, resolvedTasks)
  } else {
    const habits = await Repo.loadHabits()
    return generateTasksForPresentOrFuture(dayDate, habits, resolvedTasks)
  }
}

const retrieveTasksAction = (dayDate: DayDate): ThunkResult<{}> => async dispatch => {
  await Repo.init() // TODO put this somewhere else - works now because the first thing we do when starting app is loading tasks
  const tasks = await generateTasks(dayDate)
  dispatch(onGenerateTasksSuccessAction(tasks))
}

export const submitHabitInputsAction = (inputs: EditHabitInputs): ThunkResult<{}> => async (dispatch, state) => {
  await Repo.addHabit(inputs)
  dispatch(onSubmitHabitSuccessAction())

  // Update in-memory habits
  const selectedDate = state().selectedDate
  if (selectedDate !== undefined) {
    dispatch(retrieveTasksAction(selectedDate))
  }
}

/**
 * Inits selected date.
 * If there's a selection stored in preferences, uses it, otherwise uses today.
 */
export const initSelectedDateAction = (): ThunkResult<{}> => async dispatch => {
  const dayDateJSON: any = await Preferences.loadJSON(PreferencesKey.SELECTED_DAILY_LIST_DATE)
  const dayDate: DayDate | null = dayDateJSON !== null ? DayDateHelpers.parse(dayDateJSON) : null
  const selectedDayDate: DayDate = dayDate !== null ? dayDate : DateUtils.today()
  dispatch(setSelectedDateAction(selectedDayDate))
  dispatch(retrieveTasksAction(selectedDayDate))
}

/**
 * Sets selected date in state, retrieves habits for it and closes select date modal.
 */
export const selectDateAction = (dayDate: DayDate): ThunkResult<{}> => async dispatch => {
  dispatch(setSelectedDateAction(dayDate))
  dispatch(retrieveTasksAction(dayDate))
  dispatch(setSelectDateModalOpenAction(false))
}

export const setTaskDoneStatusAction = (task: Task, doneStatus: TaskDoneStatus): ThunkResult<{}> => async dispatch => {
  if (doneStatus == TaskDoneStatus.OPEN) {
    await Repo.removeResolvedTask({ habitId: task.habit.id, date: task.date })
  } else {
    const taskInput = { habitId: task.habit.id, done: TaskHelpers.toBoolean(doneStatus), date: task.date }
    await Repo.upsertResolvedTask(taskInput)
  }
  // TODO is it efficient to reload the list? does this work well with animation?
  dispatch(retrieveTasksAction(task.date))
}

function title(selectedDate: DayDate): string {
  if (selectedDate === undefined) {
    return ""
  }
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
    case DailyHabitsListActionTypes.TASKS_GENERATE_SUCCESS:
      return { ...state, tasks: action.payload }
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
