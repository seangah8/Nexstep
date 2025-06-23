import { StepModel } from "../../models/timeline.models"
import { UserModel } from "../../models/user.models"
import { timelineService } from "../../services/timeline.service"

interface ProfileProps{
    user : UserModel
    goal: StepModel
    onLogout : () => void
}

export function Profile({ user, goal, onLogout } : ProfileProps){

    return(
        <section className="profile">
            <h4>Profile</h4>
            <h5>{`Username: ${user.username}`}</h5>
            <h5>{`Days until goal: ${goal.end - timelineService.getToday()}`}</h5>
            <button onClick={onLogout}>Logout</button>
        </section>
    )
}