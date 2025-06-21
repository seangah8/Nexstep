import { useState } from "react"
import { CredentialsModel } from "../../models/user.models"
import { userService } from "../../services/user.service"

interface LoginProps{
    onLogin : (credentials : CredentialsModel) => void
}

export function Login( { onLogin } : LoginProps ){

    const [credentials, setCredentials] = useState<CredentialsModel>(
        userService.getEmptyCredentials()
    )

    function handleChange({target} : {target: HTMLInputElement}) : void {
      const field : string = target.name
      let value : string =  target.value
      setCredentials(prev => ({ ...prev, [field]: value }))
    } 

    return(
        <section className="login">
            <form onSubmit={()=>onLogin(credentials)}>
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