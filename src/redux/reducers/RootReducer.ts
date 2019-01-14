import { combineReducers } from "redux"
import { HabitsState } from "./HabitsReducer"
import { ApplicationState } from "./RootReducer"
import { UIState } from "./ui/UIReducer"
import { habitsReducer } from "./HabitsReducer"
import { uiReducer } from "./ui/UIReducer"

export interface ApplicationState {
  habits: HabitsState
  ui: UIState
}

const rootReducer = combineReducers<ApplicationState>({
  habits: habitsReducer,
  ui: uiReducer
})

export default rootReducer
