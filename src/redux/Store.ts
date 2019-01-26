import { Store, createStore, applyMiddleware, compose } from "redux"

import rootReducer, { ApplicationState } from "./reducers/RootReducer"
import thunk from "redux-thunk"

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore(): Store<ApplicationState> {
  const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
  return store
}
