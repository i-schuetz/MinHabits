import { Reducer, Action } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import Repo from "../../../Repo"
import * as Stats from "../../../logic/Stats"
import { WholePercentage } from "../../../models/helpers/WholePercentage"
import { MonthPercentage } from "../../../models/helpers/MonthPercentage"
import { Habit } from "../../../models/Habit"
import * as DateUtils from "../../../utils/DateUtils"
import { action } from "typesafe-actions"

export interface StatsState {
  readonly totalDonePercentage?: WholePercentage
  readonly monthDonePercentages: MonthPercentage[]
  readonly needAttentionHabits: Habit[]
}

export enum StatsActionTypes {
  SET_TOTAL_DONE_PERCENTAGE = "@@StatsActions/SET_TOTAL_DONE_PERCENTAGE",
  SET_MONTHLY_DONE_PERCENTAGES = "@@StatsActions/SET_MONTHLY_DONE_PERCENTAGES",
  SET_NEED_ATTENTION_HABITS = "@@StatsActions/SET_NEED_ATTENTION_HABITS"
}

const initialState: StatsState = {
  totalDonePercentage: undefined,
  monthDonePercentages: [],
  needAttentionHabits: []
}

type ThunkResult<R> = ThunkAction<R, StatsState, undefined, Action>
export type StatsThunkDispatch = ThunkDispatch<StatsState, undefined, Action>

export const setTotalPercentageAction = (percentage: WholePercentage) =>
  action(StatsActionTypes.SET_TOTAL_DONE_PERCENTAGE, percentage)
export const setMonthDonePercentagesAction = (percentages: MonthPercentage[]) =>
  action(StatsActionTypes.SET_MONTHLY_DONE_PERCENTAGES, percentages)
export const setNeedAttentionHabitsAction = (habits: Habit[]) =>
  action(StatsActionTypes.SET_NEED_ATTENTION_HABITS, habits)

export const fetchAllStatsAction = (): ThunkResult<{}> => async dispatch => {
  await Repo.init()
  const habits = await Repo.loadHabits()
  const resolvedTasks = await Repo.loadResolvedTasks({
    kind: "before",
    date: DateUtils.today()
  })

  const totalDonePercentage: WholePercentage = Stats.getDonePercentage(resolvedTasks)
  const donePercentageByMonth: MonthPercentage[] = Stats.getDoneMonthlyPercentage(resolvedTasks)
  const needAttentionHabits: Habit[] =
    Stats.groupHabitsByDonePercentageRange([{ digit1: 0, digit2: 4, digit3: 0 }], habits, resolvedTasks).get(40) || []

  dispatch(setTotalPercentageAction(totalDonePercentage))
  dispatch(setMonthDonePercentagesAction(donePercentageByMonth))
  dispatch(setNeedAttentionHabitsAction(needAttentionHabits))
}

export const statsReducer: Reducer<StatsState> = (state = initialState, action) => {
  switch (action.type) {
    case StatsActionTypes.SET_TOTAL_DONE_PERCENTAGE:
      return { ...state, totalDonePercentage: action.payload }
    case StatsActionTypes.SET_MONTHLY_DONE_PERCENTAGES:
      return { ...state, monthDonePercentages: action.payload }
    case StatsActionTypes.SET_NEED_ATTENTION_HABITS:
      return { ...state, needAttentionHabits: action.payload }
    default:
      return state
  }
}
