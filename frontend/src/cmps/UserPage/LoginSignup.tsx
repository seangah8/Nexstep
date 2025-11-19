import { useState } from "react"
import { CredentialsModel } from "../../models/user.models"
import { userService } from "../../services/user.service"

interface LoginProps{
    isLoading : boolean
    onLogin : (event: React.FormEvent<HTMLFormElement> ,credentials : CredentialsModel) => void
    onSignup : (event: React.FormEvent<HTMLFormElement> ,credentials : CredentialsModel) => void
}

export function LoginSignup( { isLoading, onLogin, onSignup } : LoginProps ){

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

                <div className="input-area">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        value={credentials.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-area">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                </div>

                <button disabled={isLoading} style={isLoading ? {opacity: 0.5} : {}}>
                    {isLoading ? 'Loading...' : signingUp ? `Signup` : `Login`}
                </button>
            </form>

            <a onClick={toggleLoginSignup}>
                {
                signingUp 
                ? `have user? login here` 
                : `don't have account? signup here`
                }
            </a>
        </section>
    )
}