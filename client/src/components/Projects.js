import React from 'react';
import { Outlet } from "react-router-dom";
import { useRecoilState } from 'recoil';

export default function Projects() {
    return (
        <div className='projects-container'>
            <h3>Projects</h3>
            <Outlet />
        </div>
    )
}