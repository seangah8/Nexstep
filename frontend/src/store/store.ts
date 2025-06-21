import { Reducer, combineReducers, compose, legacy_createStore as createStore } from 'redux'
import { userReducer } from './reducers/user.reducer'
import { UserAction, UserState } from './interfaces/user.store'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export interface RootState {
    userModule: UserState
}

type AppAction = UserAction
type RootReducer = Reducer<RootState, AppAction>

const rootReducer = combineReducers({
    userModule: userReducer,
}) as RootReducer

export const store = createStore(rootReducer, composeEnhancers())

// window.gStore = store