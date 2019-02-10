import { Reducer, Action } from "redux"
import { action } from "typesafe-actions"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { ApplicationState } from "../RootReducer"
import Repo from "../../../Repo"
import { resetInMemoryTasks } from "../../../redux/reducers/ui/DailyHabitsListReducer"

export enum SettingsScreenEntry {
  FEEDBACK,
  MANAGE_HABITS,
  RESET,
  ABOUT,
}

export interface SettingsState {
  readonly modalOpen?: SettingsScreenEntry
}

export enum SettingsActionTypes {
  SET_SETTINGS_ENTRY_MODAL_OPEN = "@@SettingsActionTypes/SET_SETTINGS_ENTRY_MODAL_OPEN",
}

const initialState: SettingsState = {
  modalOpen: undefined,
}

type SettingEntryModalOpenPayload = {
  entry: SettingsScreenEntry
  open: boolean
}

type ThunkResult<R> = ThunkAction<R, ApplicationState, undefined, Action>
export type SettingsThunkDispatch = ThunkDispatch<ApplicationState, undefined, Action>

export const resetProgressAction = (): ThunkResult<{}> => async (dispatch, state) => {
  await Repo.resetProgress()
  dispatch(resetInMemoryTasks())
  dispatch(setModalOpenAction(SettingsScreenEntry.RESET, false))
}

export const setModalOpenAction = (entry: SettingsScreenEntry, open: boolean) =>
  action(SettingsActionTypes.SET_SETTINGS_ENTRY_MODAL_OPEN, {
    entry: entry,
    open: open,
  } as SettingEntryModalOpenPayload)

export const settingsReducer: Reducer<SettingsState> = (state = initialState, action) => {
  switch (action.type) {
    case SettingsActionTypes.SET_SETTINGS_ENTRY_MODAL_OPEN:
      const payload: SettingEntryModalOpenPayload = action.payload
      if (action.payload.open) {
        return { ...state, modalOpen: payload.entry }
      } else {
        return { ...state, modalOpen: undefined }
      }
    default:
      return state
  }
}
