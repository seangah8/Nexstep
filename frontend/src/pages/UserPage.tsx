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
import { useState } from 'react'



export function UserPage(){

    const navigate = useNavigate()

    const loggedInUser = useSelector((storeState : RootState) => 
        storeState.userModule.loggedInUser)

    const timeline = useSelector((storeState : RootState) => 
        storeState.timelineModule.timeline)

    const [isLoading, setIsLoading] = useState(false) 

    async function loadTimeline(){
        if(loggedInUser){
            const timeline : TimelineModel | null = 
                await timelineService.get(loggedInUser._id)
            if(!timeline) navigate('/welcome')
            else timelineActions.saveTimeline(timeline)
        }
    }

    async function onLogin(ev: React.FormEvent<HTMLFormElement>, credentials: CredentialsModel): Promise<void> {
        ev.preventDefault()
        setIsLoading(true)

        try { await userActions.login(credentials) } 
        catch (err) { console.error("Login failed:", err) } 
        finally { setIsLoading(false) }
    }


    async function onSignup(ev: React.FormEvent<HTMLFormElement> ,credentials : CredentialsModel): Promise<void>{
        ev.preventDefault()
        setIsLoading(true)
        try { 
            await userActions.signup(credentials)
            navigate('/welcome')
        } 
        catch (err) { console.error("Signup failed:", err) } 
        finally { setIsLoading(false) }
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
                    isLoading={isLoading}
                    onLogin={onLogin}
                    onSignup={onSignup}
                />
            }
        </section>
    )
}