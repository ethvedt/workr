import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { loggedIn } from '../recoil/state';
import { useRecoilValue } from 'recoil';


export default function Projects() {

    const login = useRecoilValue(loggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (!login) {
            navigate('/login');
        }
    }, [])

    return (
        <div className='projects-container'>
            <h3>Projects</h3>
            <Outlet />
        </div>
    )
}