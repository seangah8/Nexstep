import { useState } from "react"
import { CredentialsModel } from "../../models/user.models"
import { userService } from "../../services/user.service"

interface LoginProps{
    onLogin : (event: React.FormEvent<HTMLFormElement> ,credentials : CredentialsModel) => void
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
            <form onSubmit={ev=>onLogin(ev ,credentials)}>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                />

                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                />

                <button>Login</button>
            </form>
        </section>
    )
}