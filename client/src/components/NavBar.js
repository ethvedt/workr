import React from 'react';
import { Link } from 'react-router-dom'
import { useRecoilValue, useRecoilState } from 'recoil';
import { loggedIn, userAtom } from '../recoil/state.js';

export default function NavBar() {
    const login = useRecoilValue(loggedIn);
    const [user, setUser] = useRecoilState(userAtom);

    function handleLogout(e) {
        fetch('/logout', {
            method: 'DELETE',
        }).then(setUser({
            id: null,
            username: null,
        }))
    }

    // const loginOrOut = login ? <h3>Log in</h3> :  <button onClick={handleLogout}>Log out</button>

    return (
        <div className='navbar'>
            <Link to='login'>{login ? (<button onClick={handleLogout}>Log out</button>) : (<h3>Log in</h3>)}</Link>
            <Link to='home'><p>Home</p></Link>
            <Link to='calendar'><p>Calendar</p></Link>
            <Link to='teams'><p>Teams</p></Link>
            <Link to='projects'><p>Projects</p></Link>
        </div>
    )
}