
import { UserAction, UserActionsType, UserState } from "../interfaces/user.store.ts"
import { userService } from "../../services/user.service.ts"

const initialState: UserState = {
    loggedInUser: userService.getLoggedinUser(),
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