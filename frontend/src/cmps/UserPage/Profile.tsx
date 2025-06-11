import { UserModel } from "../../models/user.models"

interface ProfileProps{
    user : UserModel
    onSetUser : (user : UserModel | null) => void
}

export function Profile({ user, onSetUser } : ProfileProps){

    function onLogout(){
        onSetUser(null)
    }

    return(
        <section className="profile">
            <h4>Profile</h4>
            <h5>{`Username: ${user.username}`}</h5>
            <button onClick={onLogout}>Logout</button>
        </section>
    )
}