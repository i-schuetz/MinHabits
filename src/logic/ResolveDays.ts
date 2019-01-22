import Repo from "../Repo"
import { DayDate } from "../models/DayDate"
import * as DateUtils from "../utils/DateUtils"
import * as DayDateHelpers from "../models/DayDate"
import Preferences, { PreferencesKey } from "../Preferences"
import { Task } from "../models/helpers/Task"
import * as ResolvedDaysLogic from "./ResolveDaysInternal"

export const resolveUnresolvedDays = async () => {
  const resolvedIntervalEndDate = DateUtils.yesterday()

  const loadResolvedTasks = async (lastResolvedDate: DayDate) => {
    return Repo.loadResolvedTasksWithHabits({
      kind: "between",
      startDate: lastResolvedDate,
      endDate: resolvedIntervalEndDate
    })
  }

  const loadHabits = async () => Repo.loadHabits()

  const generateTasksForUnresolvedDays = await ResolvedDaysLogic.generateTasksForUnresolvedDays(resolvedIntervalEndDate, loadResolvedTasks, loadHabits)

  const loadLastResolvedDateString = async () => await Preferences.loadString(PreferencesKey.LAST_RESOLVED_DATE)

  const saveLastResolvedDate = async (dayDate: DayDate) =>
    await Preferences.saveString(PreferencesKey.LAST_RESOLVED_DATE, DayDateHelpers.toJSON(dayDate))

  const persistResolvedTasks = async (tasks: Task[]) => {
    for (const task of tasks) {
      await Repo.upsertResolvedTask(ResolvedDaysLogic.toResolvedTaskInput(task))
    }
  }

  await ResolvedDaysLogic.resolveUnresolvedDaysDeps(
    resolvedIntervalEndDate,
    generateTasksForUnresolvedDays,
    loadLastResolvedDateString,
    loadHabits,
    saveLastResolvedDate,
    persistResolvedTasks
  )
}