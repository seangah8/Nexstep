import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../store/store'
import { CredentialsModel } from '../models/user.models'
import { LoginSignup } from "../cmps/UserPage/LoginSignup"
import { Profile } from "../cmps/UserPage/Profile"
import { userActions } from '../store/actions/user.actions'
import { TimelineModel } from '../models/timeline.models'
import { timelineService } from '../services/timeline.service'
import { timelineActions } from '../store/actions/timeline.actions'



export function UserPage(){

    const navigate = useNavigate()

    const loggedInUser = useSelector((storeState : RootState) => 
        storeState.userModule.loggedInUser)

    const timeline = useSelector((storeState : RootState) => 
        storeState.timelineModule.timeline)

    async function loadTimeline(){
        if(loggedInUser){
            const timeline : TimelineModel | null = 
                await timelineService.get(loggedInUser._id)
            if(!timeline) navigate('/welcome')
            else timelineActions.saveTimeline(timeline)
        }
    }

    function onLogin(ev: React.FormEvent<HTMLFormElement> ,credentials : CredentialsModel) : void{
        ev.preventDefault()
        userActions.login(credentials)
    }

    async function onSignup(ev: React.FormEvent<HTMLFormElement> ,credentials : CredentialsModel): Promise<void>{
        ev.preventDefault()
        await userActions.signup(credentials)
        navigate('/welcome')
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