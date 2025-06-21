
import { UserAction, UserActionsType, UserState } from "../interfaces/user.store.ts"


const initialState: UserState = {
    loggedInUser: null,
}

export function userReducer(state = initialState, cmd = {} as UserAction): UserState {
    switch (cmd.type) {

        case UserActionsType.SET_USER:
            return {
                ...state,
                loggedInUser: cmd.loggedInUser
            }      
       
        default:
            return state
    }
}