import React from 'react';
import { useRecoilValue } from 'recoil';
import { loggedIn } from '../recoil/state.js';

function NavBar() {
    const login = useRecoilValue(loggedIn)

    return (
        <>
            <span id='navbar'>
                <h2>Home</h2>
                <h2>{login ? 'Log out' : 'Log in'}</h2>
            </span>
        </>
    )
}

export default NavBar;