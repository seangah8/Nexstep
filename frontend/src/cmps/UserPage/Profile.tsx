import { UserModel } from "../../models/user.models"

interface ProfileProps{
    user : UserModel
    onLogout : () => void
}

export function Profile({ user, onLogout } : ProfileProps){

    return(
        <section className="profile">
            <h4>Profile</h4>
            <h5>{`Username: ${user.username}`}</h5>
            <button onClick={onLogout}>Logout</button>
        </section>
    )
}