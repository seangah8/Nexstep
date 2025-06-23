import { Reducer, combineReducers, compose, legacy_createStore as createStore } from 'redux'
import { userReducer } from './reducers/user.reducer'
import { UserAction, UserState } from './interfaces/user.store'
import { timelineReducer } from './reducers/timeline.reducer'
import { TimelineAction, TimelineState } from './interfaces/timeline.store'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export interface RootState {
    userModule: UserState
    timelineModule: TimelineState
}

type AppAction = UserAction | TimelineAction
type RootReducer = Reducer<RootState, AppAction>

const rootReducer = combineReducers({
    userModule: userReducer,
    timelineModule: timelineReducer,
}) as RootReducer

export const store = createStore(rootReducer, composeEnhancers())

// window.gStore = store