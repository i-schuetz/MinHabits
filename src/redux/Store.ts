import { Store, createStore } from 'redux'
import rootReducer, { ApplicationState } from './reducers/RootReducer';

export default function configureStore(): Store<ApplicationState> {
  const store = createStore(
    rootReducer
  )
  return store
}
