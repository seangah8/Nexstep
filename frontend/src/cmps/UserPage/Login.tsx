import { useState } from "react"
import { UserModel, CredentialsModel } from "../../models/user.models"
import { userService } from "../../services/user.service"

interface LoginProps{
    onSetUser : (user : UserModel) => void
}

export function Login( { onSetUser } : LoginProps ){

    const [credentials, setCredentials] = useState<CredentialsModel>(
        userService.getEmptyCredentials()
    )

    function onLogin() : void{
        const user = userService.login(credentials)
        onSetUser(user)
    }

    function handleChange({target} : {target: HTMLInputElement}) : void {

      const field : string = target.name
      let value : string =  target.value

      setCredentials(prev => ({ ...prev, [field]: value }))
    } 

    return(
        <section className="login">
            <form onSubmit={onLogin}>
                <label htmlFor="username"/>
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                />

                <button>Login</button>
            </form>
        </section>
    )
}