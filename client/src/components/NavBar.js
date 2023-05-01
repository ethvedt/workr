import React from 'react';
import { Link } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { loggedIn, userAtom } from '../recoil/state.js';

export default function NavBar() {
    const login = useRecoilValue(loggedIn);
    const setUser = useSetRecoilState(userAtom);

    function handleLogout(e) {
        fetch('/logout', {
            method: 'DELETE',
        }).then(setUser({
            id: null,
            username: null,
        }))
    }

    const loginOrOut = login ? <h3>Log in</h3> :  <button onclick={handleLogout}>Log out</button>

    return (
        <div className='navbar'>
            <Link to='login'><p>Log in</p></Link>
            <Link to='home'><p>Home</p></Link>
            <Link to='calendar'><p>Calendar</p></Link>
            <Link to='teams'><p>Teams</p></Link>
            <Link to='projects'><p>Projects</p></Link>
        </div>
    )
}