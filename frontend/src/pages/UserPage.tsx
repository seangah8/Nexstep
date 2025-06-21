import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { CredentialsModel } from '../models/user.models'
import { Login } from "../cmps/UserPage/Login"
import { Profile } from "../cmps/UserPage/Profile"
import { userActions } from '../store/actions/user.actions'


export function UserPage(){

    const user = useSelector((storeState : RootState) => 
        storeState.userModule.loggedInUser)

    function onLogin(credentials : CredentialsModel) : void{
        userActions.login(credentials)
    }

    function onLogout() : void {
        userActions.logout()
    }

    return(
        <section className="user-page">
            {
                user 

                ? <Profile
                    user={user}
                    onLogout={onLogout}
                /> 

                : <Login
                    onLogin={onLogin}
                />
            }
        </section>
    )
}