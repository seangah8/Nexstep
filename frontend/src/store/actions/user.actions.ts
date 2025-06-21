import { UserActionsType } from "../interfaces/user.store.ts";
import { store } from "../store"

export const userActions = {
    changeUsername,
}


async function changeUsername(username: string) {
    try {
        // await userService.changeUsername(username) // do it in backend
        store.dispatch({
            type: UserActionsType.CHANGE_USERNAME,
            username
        })
    } catch (err) {
        console.log('Cannot login', err)
        throw err
    }
}
