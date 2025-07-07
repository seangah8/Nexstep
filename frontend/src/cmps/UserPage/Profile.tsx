import { TimelineModel } from "../../models/timeline.models"
import { UserModel } from "../../models/user.models"
import { timelineService } from "../../services/timeline.service"

interface ProfileProps{
    loggedInUser : UserModel
    timeline: TimelineModel | null
    onLogout : () => void
}

export function Profile({ loggedInUser, timeline, onLogout } : ProfileProps){


    if(!timeline) return <h5>Loading...</h5>

    return(
        <section className="profile">
            <h4>Profile</h4>
            <h5>{`Username: ${loggedInUser.username}`}</h5>
            <h5>{`Days until goal: ${timeline.steps[0].end - timelineService.getToday()}`}</h5>
            <button onClick={onLogout}>Logout</button>
        </section>
    )
}