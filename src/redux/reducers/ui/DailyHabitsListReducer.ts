import { Reducer, Action } from "redux"
import { action } from "typesafe-actions"
import Repo from "../../../Repo"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { DayDate } from "../../../models/DayDate"
import * as DayDateHelpers from "../../../models/DayDate"
import * as DateUtils from "../../../utils/DateUtils"
import Preferences, { PreferencesKey } from "../../../Preferences"
import { Order } from "../../../models/helpers/Order"
import { generateTasksForOpenDate, generateTasksForResolvedDate } from "../../../logic/GenerateTasksForDate"
import { Task, TaskDoneStatus } from "../../../models/helpers/Task"
import * as TaskHelpers from "../../../models/helpers/Task"
import { ApplicationState } from "../RootReducer"
import { InteractionManager } from "react-native"

export interface DailyHabitsListState {
  readonly tasks: Task[]
  readonly selectDateModalOpen: boolean
  readonly selectedDate?: DayDate
  readonly title: String
  readonly enterCustomDateModalOpen: boolean
}

export enum DailyHabitsListActionTypes {
  TASKS_GENERATE_SUCCESS = "@@DailyHabitsListActions/TASKS_GENERATE_SUCCESS",
  SET_SELECT_DATE_MODAL_OPEN = "@@DailyHabitsListActions/SET_SELECT_DATE_MODAL_OPEN",
  INIT_SELECTED_DATE = "@@DailyHabitsListActions/INIT_SELECTED_DATE",
  SET_SELECTED_DATE = "@@DailyHabitsListActions/SET_SELECTED_DATE",
  SET_TASK_DONE = "@@DailyHabitsListActions/SET_TASK_DONE",
  SET_ENTER_CUSTOM_DATE_MODAL_OPEN = "@@DailyHabitsListActions/SET_ENTER_CUSTOM_DATE_MODAL_OPEN",
}

const initialState: DailyHabitsListState = {
  tasks: [],
  selectDateModalOpen: false,
  selectedDate: undefined,
  title: "",
  enterCustomDateModalOpen: false,
}

export const setSelectDateModalOpenAction = (open: boolean) =>
  action(DailyHabitsListActionTypes.SET_SELECT_DATE_MODAL_OPEN, open)
export const onGenerateTasksSuccessAction = (tasks: Task[]) =>
  action(DailyHabitsListActionTypes.TASKS_GENERATE_SUCCESS, tasks)
const setSelectedDateAction = (date: DayDate) => action(DailyHabitsListActionTypes.SET_SELECTED_DATE, date)
export const setEnterCustomDateModalOpenAction = (open: boolean) =>
  action(DailyHabitsListActionTypes.SET_ENTER_CUSTOM_DATE_MODAL_OPEN, open)

type ThunkResult<R> = ThunkAction<R, ApplicationState, undefined, Action>
export type DailyHabitsListThunkDispatch = ThunkDispatch<ApplicationState, undefined, Action>

const generateTasks: (dayDate: DayDate) => Promise<Task[]> = async (dayDate: DayDate) => {
  const resolvedTasks = await Repo.loadResolvedTasksWithHabits({ kind: "match", date: dayDate })
  if (DateUtils.isPast(dayDate)) {
    return generateTasksForResolvedDate(dayDate, resolvedTasks)
  } else {
    const habits = await Repo.loadHabits()
    return generateTasksForOpenDate(dayDate, habits, resolvedTasks)
  }
}

const retrieveTasksAction = (dayDate: DayDate): ThunkResult<{}> => async dispatch => {
  await Repo.init() // TODO put this somewhere else - works now because the first thing we do when starting app is loading tasks
  const tasks = await generateTasks(dayDate)
  dispatch(onGenerateTasksSuccessAction(tasks))
}

export const updateTasksForCurrentDate = (): ThunkResult<{}> => async (dispatch, state) => {
  // Update in-memory habits
  const selectedDate = state().ui.dailyHabitsList.selectedDate
  console.log("updating with selected date: " + JSON.stringify(selectedDate))

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
  dispatch(setEnterCustomDateModalOpenAction(false))
  // When selecting a custom date, runAfterInteractions is necessary, otherwise the app freezes.
  // It's not good to have this here as it's purely UI related but letting it for now. TODO (low prio)
  InteractionManager.runAfterInteractions(() => {
    dispatch(setSelectDateModalOpenAction(false))
  })
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
    case DailyHabitsListActionTypes.TASKS_GENERATE_SUCCESS:
      return { ...state, tasks: action.payload }
    case DailyHabitsListActionTypes.SET_SELECT_DATE_MODAL_OPEN:
      return { ...state, selectDateModalOpen: action.payload }
    case DailyHabitsListActionTypes.SET_SELECTED_DATE:
      return { ...state, selectedDate: action.payload, title: title(action.payload) }
    case DailyHabitsListActionTypes.SET_ENTER_CUSTOM_DATE_MODAL_OPEN:
      return { ...state, enterCustomDateModalOpen: action.payload }
    default:
      return state
  }
}
