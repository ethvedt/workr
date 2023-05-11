import React, {useEffect} from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { loggedIn } from '../recoil/state';
import { useRecoilValue } from 'recoil';

export default function Teams() {

    const login = useRecoilValue(loggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (!login) {
            navigate('/login');
        }
    }, [])

    return (
        <div className='teams-container'>
            <h2>Your Teams</h2>
            <Link to='new'>New Team</Link>
            <Outlet />
        </div>
    )
}