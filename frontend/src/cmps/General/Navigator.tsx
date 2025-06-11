import { NavLink } from 'react-router-dom'

export function Navigator(){
    return(
        <section className='navigator'>
            <NavLink to="/timeline">Timeline</NavLink> 
            <NavLink to="/user">Profile</NavLink> 
        </section>
    )
}