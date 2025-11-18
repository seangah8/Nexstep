import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { NavLink } from 'react-router-dom'
import { userActions } from '../../store/actions/user.actions'

export function Menu(){

    const loggedInUser = useSelector((storeState: RootState) => 
        storeState.userModule.loggedInUser)

    const [isOpen, setIsOpen] = useState<boolean>(false)

    async function onLogout(){
        await userActions.logout()
        setIsOpen(false)
    }

    return(
        <section className='menu'>
            <button onClick={()=>setIsOpen(prev=>!prev)}>
                <img className={`image ${isOpen ? 'turned' : ''}`}
                    src="/nextep_icon_black.png" 
                    alt="nextep-logo" 
                />
            </button>

            {
                <section className={`menu-window ${isOpen ? 'visible' : ''}`}>
                    <NavLink onClick={()=>setIsOpen(false)} to="/timeline">
                        <i className="fa-regular fa-calendar"></i>
                        <p>Timeline</p>
                    </NavLink> 

                    <NavLink onClick={()=>setIsOpen(false)} to="/user">
                        <i className="fa-regular fa-user"></i>
                        <p>{loggedInUser ? 'Profile' : 'Login'}</p>
                    </NavLink> 

                    { 
                    loggedInUser && 
                    <NavLink onClick={onLogout} to="/user">
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <p>Logout</p>
                    </NavLink> 
                    }
                </section>
            }

        </section>
    )
}