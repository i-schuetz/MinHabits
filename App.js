import App from "./build/App"
import React from "react"
import { Provider } from "react-redux"
import configureStore from "./src/redux/Store"

export default () => (
  <Provider store={configureStore()}>
    <App />
  </Provider>
)

