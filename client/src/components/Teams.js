import React from 'react';
import { Outlet } from "react-router-dom";

export default function Teams() {

    return (
        <div className='teams-container'>
            <h3>Your Teams</h3>
            <Outlet />
        </div>
    )
}