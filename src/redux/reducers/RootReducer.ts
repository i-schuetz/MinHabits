import { combineReducers } from "redux"
import { ApplicationState } from "./RootReducer"
import { UIState } from "./ui/UIReducer"
import { uiReducer } from "./ui/UIReducer"

export interface ApplicationState {
  ui: UIState
}

const rootReducer = combineReducers<ApplicationState>({
  ui: uiReducer
})

export default rootReducer
