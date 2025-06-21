
// defines the structure of a user object 
import { UserModel } from "../../models/user.models";

// define the shape of the user slice of the Redux state
export interface UserState {
    user: UserModel | null
}

// define all possible action types for the user state
export enum UserActionsType {
    CHANGE_USERNAME = 'CHANGE_USERNAME'
}

// define the structure of the CHANGE_USERNAME action
interface ChangeUsernameAction {
    type: UserActionsType.CHANGE_USERNAME
    username: string
}

// Combine all user-related actions into a single type
export type UserAction = ChangeUsernameAction
