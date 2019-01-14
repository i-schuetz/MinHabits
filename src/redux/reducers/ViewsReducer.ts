import { Reducer } from "redux"
import { action } from "typesafe-actions"

export interface ViewsState {
  readonly editHabitModalOpen: boolean
}

export enum ViewsActionTypes {
  SET_EDIT_HABIT_MODAL_OPEN = "@@ViewsActions/SET_EDIT_HABIT_MODAL_OPEN"
}

const initialState: ViewsState = {
  editHabitModalOpen: false
}

export const openEditHabitModalAction = (open: boolean) => action(ViewsActionTypes.SET_EDIT_HABIT_MODAL_OPEN, open)

const viewsReducer: Reducer<ViewsState> = (state = initialState, action) => {
  switch (action.type) {
    case ViewsActionTypes.SET_EDIT_HABIT_MODAL_OPEN: {
      return { ...state, editHabitModalOpen: action.payload }
    }
    default:
      return state
  }
}

export default viewsReducer
