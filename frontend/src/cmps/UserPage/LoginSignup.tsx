import { useState } from "react"
import { CredentialsModel } from "../../models/user.models"
import { userService } from "../../services/user.service"

interface LoginProps{
    onLogin : (event: React.FormEvent<HTMLFormElement> ,credentials : CredentialsModel) => void
    onSignup : (event: React.FormEvent<HTMLFormElement> ,credentials : CredentialsModel) => void
}

export function LoginSignup( { onLogin, onSignup } : LoginProps ){

    const [credentials, setCredentials] = useState<CredentialsModel>(
        userService.getEmptyCredentials()
    )

    const [signingUp, setSigningUp] = useState<boolean>(false)

    function handleChange({target} : {target: HTMLInputElement}) : void {
      const field : string = target.name
      let value : string =  target.value
      setCredentials(prev => ({ ...prev, [field]: value }))
    } 

    function toggleLoginSignup(){
        setSigningUp(prev=>!prev)
    }

    return(
        <section className="login-signup">
            <h4>{signingUp ? `Signup` : `Login`}</h4>
            <form onSubmit={ev=>signingUp ? onSignup(ev ,credentials) : onLogin(ev ,credentials)}>
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

                <button>{signingUp ? `Signup` : `Login`}</button>
            </form>

            <button onClick={toggleLoginSignup}>
                {
                signingUp 
                ? `have user? login here` 
                : `don't have account? signup here`
                }
            </button>
        </section>
    )
}