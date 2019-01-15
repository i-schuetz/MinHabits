import { Store, createStore, applyMiddleware } from 'redux'
import rootReducer, { ApplicationState } from './reducers/RootReducer';
import thunk from 'redux-thunk';

export default function configureStore(): Store<ApplicationState> {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
  )
  return store
}
