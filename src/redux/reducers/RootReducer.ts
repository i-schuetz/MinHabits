import { combineReducers } from "redux"
import habits, { HabitsState } from "./HabitsReducer"
import views from "./ViewsReducer"
import { ViewsState } from "./ViewsReducer"
import { ApplicationState } from "./RootReducer"

export interface ApplicationState {
  habits: HabitsState
  views: ViewsState
}

const rootReducer = combineReducers<ApplicationState>({
  habits: habits,
  views: views
})

export default rootReducer
