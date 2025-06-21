import { UserModel } from "../../models/user.models.ts"
import { UserAction, UserActionsType, UserState } from "../interfaces/user.store.ts"


const initialState: UserState = {
    user: null,
}

export function userReducer(state = initialState, cmd = {} as UserAction): UserState {
    switch (cmd.type) {

        case UserActionsType.CHANGE_USERNAME:
            const user = state.user as UserModel
            return {
                ...state,
                user: { ...user, username: cmd.username }
            }
        default:
            return state
    }
}