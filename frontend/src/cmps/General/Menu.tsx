import { useState } from 'react'
import { NavLink } from 'react-router-dom'

export function Menu(){

    const [isOpen, setIsOpen] = useState<boolean>(false)

    return(
        <section className='menu'>
            <button onClick={()=>setIsOpen(prev=>!prev)}>
                <i className="fa-solid fa-bars"></i>
            </button>

            {
                isOpen && 
                <section className='menu-window'>
                    <NavLink to="/timeline">Timeline</NavLink> 
                    <NavLink to="/user">Profile</NavLink> 
                </section>
            }

        </section>
    )
}