import { Reducer, Action } from "redux"
import { action } from "typesafe-actions"
import * as ResolveDays from "../../../logic/ResolveDays"
import * as Popups from "../../../logic/Popups"
import Repo from "../../../Repo"
import * as DateUtils from "../../../utils/DateUtils"
import { CongratulationsPopupAction } from "../../../logic/Popups"
import { DayDate } from "../../../models/DayDate"
import { ThunkDispatch, ThunkAction } from "redux-thunk"
import { Habit } from "../../../models/Habit"

export interface AppState {
  readonly congratsPopupState: CongratsPopupState
  readonly needAttentionPopupState: HabitsNeedAttentionPopupState
}

export enum AppActionTypes {
  OPEN_CONGRATS_POPUP = "@@AppActionTypes/OPEN_CONGRATS_POPUP",
  CLOSE_CONGRATS_POPUP = "@@AppActionTypes/CLOSE_CONGRATS_POPUP",
  OPEN_HABITS_NEED_ATTENTION_POPUP = "@@AppActionTypes/OPEN_HABITS_NEED_ATTENTION_POPUP",
  CLOSE_HABITS_NEED_ATTENTION_POPUP = "@@AppActionTypes/STORE_WILL_DO_NEED_ATTENTION_HABITS_SUCCESS",

  // TODO maybe delete this - not being used - we close popup in advance
  STORE_WILL_DO_NEED_ATTENTION_HABITS_SUCCESS = "@@AppActionTypes/STORE_WILL_DO_NEED_ATTENTION_HABITS_SUCCESS",

  DELETE_NEED_ATTENTION_HABITS = "@@AppActionTypes/DELETE_NEED_ATTENTION_HABITS",
  DELETE_NEED_ATTENTION_HABITS_SUCCESS = "@@AppActionTypes/DELETE_NEED_ATTENTION_HABITS_SUCCESS"
}

const initialState: AppState = {
  congratsPopupState: { kind: "closed" },
  needAttentionPopupState: { kind: "closed" },

  // Dummy data
  // congratsPopupState: {
  //   kind: "open",
  //   contents: {
  //     title: "Congrats!",
  //     description: "You completed a perfect week!",
  //     callToAction: "Keep going!",
  //     okButtonLabel: "Yeah!"
  //   }
  // }
  // needAttentionPopupState: {
  //   kind: "open",
  //   contents: {
  //     title: "Attention!",
  //     introduction: "There habits are feeling abandoned",
  //     habitsNamesString: "Fishing, Hunting, Sleeping",
  //     callToAction: "What do you want to do with them?",
  //     willDoButtonLabel: "I'll do them!",
  //     removeHabitsButtonLabel: "Remove",
  //     habits: []
  //   }
  // }
}

export const onAppComesToForegroundAction = async () => {
  await ResolveDays.resolveUnresolvedDays()

  onResolvedTasksUpdated()
}

/**
 * Called after all pending days have been resolved.
 * Example 1: User went to sleep yesterday and opens app today. This is called after yesterday's tasks were resolved.
 * Example 2: User didn't use the app for a week. This is called after the tasks for the week were resolved.
 */
const onResolvedTasksUpdated = () => {
  updateNeedAttentionWaitingHabitsList()
  checkPoups()
}

/**
 * Update waiting list (removes habits that are waiting longer than a week, allowing them to appear again in the popup)
 */
const updateNeedAttentionWaitingHabitsList = async () => {
  const habitsNeedAttentionWaiting = await Repo.loadHabitsAttentionWaiting()
  const updatedHabitsNeedAttentionWaiting = Popups.updateNeedAttentionWaitingHabits(habitsNeedAttentionWaiting)
  await Repo.overwriteHabitsAttentionWaiting(updatedHabitsNeedAttentionWaiting)
  console.log(`Finished updating need attention habits. Updated count: ${updatedHabitsNeedAttentionWaiting.length}`);
}

/**
 * Show popups if conditions are met.
 */
const checkPoups = async () => {
  // Only one of these shows at a time - if there are habits that need attention, there will be no congrats popup
  // the congrats popup shows only if all habits were 100%.
  const endDate = DateUtils.today()
  const startDate = DateUtils.addWeek(endDate, -1)
  await checkHabitNeedsAttentionPopup(startDate, endDate)
  await checkCongratsPopup(startDate, endDate)
}

const checkHabitNeedsAttentionPopup = async (startDate: DayDate, endDate: DayDate) => {
  const result = await Popups.showHabitNeedsAttentionPopup(
    () => Repo.loadHabitsAttentionWaiting(),
    await Repo.loadResolvedTasks({
      kind: "between",
      startDate: startDate,
      endDate: endDate
    }),
    await Repo.loadHabits()
  )

  switch (result.kind) {
    case "show":
      openHabitsNeedAttentionPopupAction(result.habits)
      break
    case "none":
      break
  }
}

const checkCongratsPopup = async (startDate: DayDate, endDate: DayDate) => {
  const result = await Popups.showCongratulationsPopup(
    await Repo.loadResolvedTasks({
      kind: "between",
      startDate: startDate,
      endDate: endDate
    })
  )
  switch (result) {
    case CongratulationsPopupAction.SHOW_WEEKLY:
      openCongratsPopupAction()
      break
    case CongratulationsPopupAction.NONE:
      break
  }
}

export const openCongratsPopupAction = () => action(AppActionTypes.OPEN_CONGRATS_POPUP)
export const closeCongratsPopupOpenAction = () => action(AppActionTypes.CLOSE_CONGRATS_POPUP)
export const openHabitsNeedAttentionPopupAction = (habits: Habit[]) =>
  action(AppActionTypes.OPEN_HABITS_NEED_ATTENTION_POPUP, habits)
export const closeHabitsNeedAttentionPopupAction = () => action(AppActionTypes.CLOSE_HABITS_NEED_ATTENTION_POPUP)
export const storeWillDoNeedAttentionHabitsActionSuccess = () =>
  action(AppActionTypes.STORE_WILL_DO_NEED_ATTENTION_HABITS_SUCCESS)
export const removeNeedAttentionHabitsAction = (habits: Habit[]) =>
  action(AppActionTypes.DELETE_NEED_ATTENTION_HABITS, habits)
export const needAttentionHabitsDeleteSuccess = () => action(AppActionTypes.DELETE_NEED_ATTENTION_HABITS_SUCCESS)

type ThunkResult<R> = ThunkAction<R, AppState, undefined, Action>
export type AppReducerThunkDispatch = ThunkDispatch<AppState, undefined, Action>

// TODO confirmation popup before deleting
export const deleteHabitsNeedingAttentionAction = (habits: Habit[]): ThunkResult<{}> => async dispatch => {
  await Repo.deleteHabits(habits.map((habit) => habit.id)) // TODO put this somewhere else - works now because the first thing we do when starting app is loading tasks
  dispatch(needAttentionHabitsDeleteSuccess())
}

export const willDoNeedAttentionHabitsAction = (habits: Habit[]): ThunkResult<{}> => async dispatch => {
  dispatch(closeHabitsNeedAttentionPopupAction())

  // const habitsNeedAttentionWaiting = await Repo.loadHabitsAttentionWaiting()
  // const updatedHabitsNeedAttentionWaiting = Popups.updateNeedAttentionWaitingHabits(habitsNeedAttentionWaiting)
  // Mark as waiting
  for (const habit of habits) {
    await Repo.addHabitAttentionWaiting({ habitId: habit.id, date: DateUtils.today() })
  }
  console.log(`Added new need attention habits (${habits.length})`);
  
  dispatch(needAttentionHabitsDeleteSuccess())
}

export const appReducer: Reducer<AppState> = (state = initialState, action) => {
  switch (action.type) {
    case AppActionTypes.OPEN_CONGRATS_POPUP:
      return { ...state, congratsPopupState: { kind: "open", contents: generateCongratsPopupContents() } }
    case AppActionTypes.CLOSE_CONGRATS_POPUP:
      return { ...state, congratsPopupState: { kind: "closed" } }
    case AppActionTypes.CLOSE_HABITS_NEED_ATTENTION_POPUP:
      return { ...state, needAttentionPopupState: { kind: "closed" } }
    case AppActionTypes.OPEN_HABITS_NEED_ATTENTION_POPUP:
      const habits: Habit[] = action.payload
      return {
        ...state,
        needAttentionPopupState: { kind: "open", contents: generateHabitsNeedAttentionPopupContents(habits) }
      }
    // case AppActionTypes.STORE_WILL_DO_NEED_ATTENTION_HABITS_SUCCESS:
    //   return { ...state, needAttentionPopupState: { kind: "closed" } }
    default:
      return state
  }
}

const generateHabitsNeedAttentionPopupContents = (habits: Habit[]): HabitsNeedAttentionPopupContents => {
  const plural = habits.length > 0
  const introduction = plural ? "There habits are feeling abandoned:" : "This habit is feeling abandoned:"
  const callToAction = plural ? "What do you want to do with them?" : "What do you want to do with it?"
  const willDoButtonLabel = plural ? "I'll do them!" : "I'll do it!"
  return {
    title: "Attention!",
    introduction: introduction,
    habitsNamesString: habits.map(habit => habit.name).join(","),
    callToAction: callToAction,
    willDoButtonLabel: willDoButtonLabel,
    removeHabitsButtonLabel: "Remove",
    habits: habits
  }
}

const generateCongratsPopupContents = (): CongratsPopupContents => {
  return {
    title: "Congrats!",
    description: "You completed a perfect week!",
    callToAction: "Keep going!",
    okButtonLabel: "Yeah!"
  }
}

export type HabitsNeedAttentionPopupContents = {
  title: string
  introduction: string
  habitsNamesString: string
  callToAction: string
  willDoButtonLabel: string
  removeHabitsButtonLabel: string
  // addReminderButtonLabel: string // TODO
  habits: Habit[] // Habits used to generate popup data. To pass around.
}

export type HabitsNeedAttentionPopupState = HabitsNeedAttentionPopupStateOpen | HabitsNeedAttentionPopupStateClosed

export interface HabitsNeedAttentionPopupStateOpen {
  kind: "open"
  contents: HabitsNeedAttentionPopupContents
}

export interface HabitsNeedAttentionPopupStateClosed {
  kind: "closed"
}

export type CongratsPopupContents = {
  title: string
  description: string
  callToAction: string
  okButtonLabel: string
}

export type CongratsPopupState = CongratsPopupStateOpen | CongratsPopupStateClosed

export interface CongratsPopupStateOpen {
  kind: "open"
  contents: CongratsPopupContents
}

export interface CongratsPopupStateClosed {
  kind: "closed"
}
