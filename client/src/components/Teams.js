import React from 'react';
import { Outlet } from "react-router-dom";
import { useRecoilState } from 'recoil';

export default function Teams() {
    return (
        <div className='teams'>
            <h3>Your Teams</h3>
            <Outlet />
        </div>
    )
}