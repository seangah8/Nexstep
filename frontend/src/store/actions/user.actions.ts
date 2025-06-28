import { store } from "../store"
import { UserActionsType } from "../interfaces/user.store.ts";
import { CredentialsModel } from "../../models/user.models.ts";
import { userService } from "../../services/user.service.ts";

export const userActions = {
    login,
    signup,
    logout,
}


async function login(credentials: CredentialsModel) : Promise<void> {
    try {
        const user = await userService.login(credentials)
        store.dispatch({
            type: UserActionsType.SET_USER,
            loggedInUser: user
        })
    } catch (err) {
        console.log('Cannot login', err)
        throw err
    }
}

async function signup(credentials: CredentialsModel) : Promise<void> {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({
            type: UserActionsType.SET_USER,
            loggedInUser: user
        })
    } catch (err) {
        console.log('Cannot signup', err)
        throw err
    }
}

async function logout() : Promise<void> {
    try {
        await userService.logout()
        store.dispatch({
            type: UserActionsType.SET_USER,
            loggedInUser: null
        })
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
}
