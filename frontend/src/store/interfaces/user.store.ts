
// defines the structure of a user object 
import { UserModel } from "../../models/user.models";

// define the shape of the user slice of the Redux state
export interface UserState {
    loggedInUser: UserModel | null
}

// define all possible action types for the user state
export enum UserActionsType {
    SET_USER = 'SET_USER'
}

// define the structure of the CHANGE_USERNAME action
interface SetUserAction {
    type: UserActionsType.SET_USER
    loggedInUser: UserModel | null
}

// Combine all user-related actions into a single type
export type UserAction = SetUserAction
