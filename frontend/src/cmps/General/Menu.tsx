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
                <i className="fa-solid fa-bars"></i>
            </button>

            {
                isOpen && 
                <section className='menu-window'>

                    <NavLink onClick={()=>setIsOpen(false)} to="/timeline">
                        <i className="fa-regular fa-calendar"></i>
                        Timeline
                    </NavLink> 

                    <NavLink onClick={()=>setIsOpen(false)} to="/user">
                        <i className="fa-regular fa-user"></i>
                        {loggedInUser ? 'Profile' : 'Login'}
                    </NavLink> 

                    { 
                    loggedInUser && 
                    <NavLink onClick={onLogout} to="/user">
                        <i className="fa-solid fa-right-from-bracket"></i>
                        Logout
                    </NavLink> 
                    }
                </section>
            }

        </section>
    )
}