import React from 'react';
import { useRecoilValue } from 'recoil';
import { loggedIn } from '../recoil/state.js';

function NavBar() {
    loggedIn = useRecoilValue(loggedIn)

    return (
        <>
            <span>
                <h2>Home</h2>
                <h2>{loggedIn ? 'Log out' : 'Log in'}</h2>
            </span>
        </>
    )
}

export default NavBar;