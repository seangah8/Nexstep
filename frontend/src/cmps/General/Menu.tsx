import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { userActions } from '../../store/actions/user.actions'

export function Menu(){

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
                    <NavLink onClick={()=>setIsOpen(false)} to="/timeline">Timeline</NavLink> 
                    <NavLink onClick={()=>setIsOpen(false)} to="/user">Profile</NavLink> 
                    <NavLink onClick={onLogout} to="/user">Logout</NavLink> 
                </section>
            }

        </section>
    )
}