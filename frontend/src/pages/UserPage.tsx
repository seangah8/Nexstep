import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { CredentialsModel } from '../models/user.models'
import { LoginSignup } from "../cmps/UserPage/LoginSignup"
import { Profile } from "../cmps/UserPage/Profile"
import { userActions } from '../store/actions/user.actions'
import { TimelineModel } from '../models/timeline.models'
import { timelineService } from '../services/timeline.service'
import { timelineActions } from '../store/actions/timeline.actions'


export function UserPage(){

    const loggedInUser = useSelector((storeState : RootState) => 
        storeState.userModule.loggedInUser)

    const timeline = useSelector((storeState : RootState) => 
        storeState.timelineModule.timeline)

    async function loadTimeline(){
        if(loggedInUser){
            const timeline : TimelineModel = 
                await timelineService.get(loggedInUser._id)
            timelineActions.saveTimeline(timeline)
        }
    }

    function onLogin(ev: React.FormEvent<HTMLFormElement> ,credentials : CredentialsModel) : void{
        ev.preventDefault()
        userActions.login(credentials)
    }

    async function onSignup(ev: React.FormEvent<HTMLFormElement> ,credentials : CredentialsModel): Promise<void>{
        ev.preventDefault()
        await userActions.signup(credentials)
        timelineActions.createTimeline()
    }

    return(
        <section className="user-page">
            {
                loggedInUser 

                ? <Profile
                    loggedInUser={loggedInUser}
                    timeline={timeline}
                    loadTimeline={loadTimeline}
                /> 

                : <LoginSignup
                    onLogin={onLogin}
                    onSignup={onSignup}
                />
            }
        </section>
    )
}