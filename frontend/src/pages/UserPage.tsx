import { useState } from "react"
import { UserModel } from "../models/user.models"
import { Login } from "../cmps/UserPage/Login"
import { Profile } from "../cmps/UserPage/Profile"


export function UserPage(){

    const [user, setUser] = useState<UserModel | null>(null)

    function onSetUser(user : UserModel | null) : void{
        setUser(user)
    }

    return(
        <section className="user-page">
            {
                user 

                ? <Profile
                    user={user}
                    onSetUser={onSetUser}
                /> 

                : <Login
                    onSetUser={onSetUser}
                />
            }
        </section>
    )
}