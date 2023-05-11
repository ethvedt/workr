import React from 'react';
import { Outlet, Link } from "react-router-dom";

export default function Teams() {

    return (
        <div className='teams-container'>
            <h2>Your Teams</h2>
            <Link to='new'>New Team</Link>
            <Outlet />
        </div>
    )
}