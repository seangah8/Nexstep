import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { CredentialsModel } from '../models/user.models'
import { LoginSignup } from "../cmps/UserPage/LoginSignup"
import { Profile } from "../cmps/UserPage/Profile"
import { userActions } from '../store/actions/user.actions'


export function UserPage(){

    const user = useSelector((storeState : RootState) => 
        storeState.userModule.loggedInUser)

    const steps = useSelector((storeState : RootState) => 
        storeState.timelineModule.steps)

    function onLogin(ev: React.FormEvent<HTMLFormElement> ,credentials : CredentialsModel) : void{
        ev.preventDefault()
        userActions.login(credentials)
    }

    function onSignup(ev: React.FormEvent<HTMLFormElement> ,credentials : CredentialsModel): void{
        ev.preventDefault()
        userActions.signup(credentials)
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
                    goal={steps[0]}
                    onLogout={onLogout}
                /> 

                : <LoginSignup
                    onLogin={onLogin}
                    onSignup={onSignup}
                />
            }
        </section>
    )
}