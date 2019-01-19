import { Reducer } from "redux"
import { action } from "typesafe-actions"

export interface SettingsState {
  readonly modalOpen?: SettingsScreenEntry
}

export enum SettingsActionTypes {
  SET_SETTINGS_ENTRY_MODAL_OPEN = "@@SettingsActionTypes/SET_SETTINGS_ENTRY_MODAL_OPEN"
}

const initialState: SettingsState = {
  modalOpen: undefined
}

export enum SettingsScreenEntry {
  FEEDBACK,
  MANAGE_HABITS,
  ABOUT,
}

type SettingEntryModalOpenPayload = {
  entry: SettingsScreenEntry
  open: boolean
}

export const setModalOpenAction = (entry: SettingsScreenEntry, open: boolean) =>
  action(SettingsActionTypes.SET_SETTINGS_ENTRY_MODAL_OPEN, {
    entry: entry,
    open: open
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
