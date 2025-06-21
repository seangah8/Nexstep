import { store } from "../store"
import { UserActionsType } from "../interfaces/user.store.ts";
import { CredentialsModel } from "../../models/user.models.ts";
import { userService } from "../../services/user.service.ts";

export const userActions = {
    login,
    logout,
}


function login(credentials: CredentialsModel) : void {
    try {
        const user = userService.login(credentials) // do it in backend
        store.dispatch({
            type: UserActionsType.SET_USER,
            loggedInUser: user
        })
    } catch (err) {
        console.log('Cannot login', err)
        throw err
    }
}

function logout() : void {
    try {
        // userService.logout() // do it in backend
        store.dispatch({
            type: UserActionsType.SET_USER,
            loggedInUser: null
        })
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
}
