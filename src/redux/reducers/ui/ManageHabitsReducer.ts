import { Reducer, Action } from "redux"
import { action } from "typesafe-actions"
import Repo from "../../../Repo"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { ApplicationState } from "../RootReducer"
import { Habit } from "../../../models/Habit"
import { setModalOpenAction, SettingsScreenEntry } from "./SettingsReducer"
import { updateTasksForCurrentDate } from "./DailyHabitsListReducer"
import { fetchAllStatsAction } from "./StatsReducer"

export interface ManageHabitsState {
  readonly habits: Habit[]
}

export enum ManageHabitsActionTypes {
  GET_HABITS_SUCCESS = "@@ManageHabitsActionTypes/GET_HABITS_SUCCESS",
  DELETE_HABIT_SUCCESS = "@@ManageHabitsActionTypes/DELETE_HABIT_SUCCESS",
  RESORT_HABITS_SUCCESS = "@@ManageHabitsActionTypes/RESORT_HABITS_SUCCESS",
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
  await Repo.deleteHabits([habit.id])
  dispatch(action(ManageHabitsActionTypes.DELETE_HABIT_SUCCESS))
  dispatch(getHabitsAction())

  // Make dependencies refresh
  // TODO (low prio) it doesn't seem right to trigger this from here, there could be a middleware instead
  // (ideally in DailyhabitsListReducer and StatsReducer files?) that observes DELETE_HABIT_SUCCESS
  dispatch(fetchAllStatsAction())
  dispatch(updateTasksForCurrentDate())
}

export const reorderHabitsAction = (newList: Habit[]): ThunkResult<{}> => async dispatch => {
  const sortedHabitInputs = newList.map((habit, index) => {
    return {
      id: habit.id,
      name: habit.name,
      timeRuleValue: habit.time.value,
      startDate: habit.time.start,
      order: index,
    }
  })

  // Broadcast immediately the re-sorted habits. If we wait until the db fetch, there's flickering in the manage habits view
  // (because when the reordered row is dropped it reloads its current in-memory model)
  dispatch(
    retrieveHabitsSuccessAction(
      newList.map((habit, index) => {
        return {
          ...habit,
          order: index,
        }
      })
    )
  )

  Repo.upsertHabits(sortedHabitInputs)

  // Notify that resort found place
  dispatch(action(ManageHabitsActionTypes.RESORT_HABITS_SUCCESS))
  // Well, we should listen to RESORT_HABITS_SUCCESS in daily reducer and update but since this requires middleware (TODO) let's just call the update directly from here.
  dispatch(updateTasksForCurrentDate())

  // Fetch habits from db and broadcast. With the in-memory update this is not really necessary, but to guarantee consistency with the db.
  const habits = await Repo.loadHabits()
  console.log("loaded habits after reorder: " + JSON.stringify(habits))

  dispatch(retrieveHabitsSuccessAction(habits))
}

export const manageHabitsReducer: Reducer<ManageHabitsState> = (state = initialState, action) => {
  switch (action.type) {
    case ManageHabitsActionTypes.GET_HABITS_SUCCESS:
      return { ...state, habits: action.payload }
    default:
      return state
  }
}
