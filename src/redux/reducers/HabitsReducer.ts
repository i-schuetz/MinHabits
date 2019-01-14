import { Reducer } from "redux"

export type HabitsState = {}

export enum HabitsActionTypes {
  FETCH_REQUEST = "@@habits/FETCH_REQUEST",
  FETCH_SUCCESS = "@@habits/FETCH_SUCCESS",
  FETCH_ERROR = "@@habits/FETCH_ERROR"
}

const initialState: HabitsState = {}

const habitsReducer: Reducer<HabitsState> = (state = initialState, action) => {
  console.log("reducer returning state: " + JSON.stringify(state))
  switch (action.type) {
    // case HabitsActionTypes.FETCH_REQUEST: {
    //   return { ...state, loading: true }
    // }
    // case HabitsActionTypes.FETCH_SUCCESS: {
    //   return { ...state, loading: false, data: action.payload }
    // }
    // case HabitsActionTypes.FETCH_ERROR: {
    //   return { ...state, loading: false, errors: action.payload }
    // }
    default:
      return state
  }
}

export default habitsReducer
