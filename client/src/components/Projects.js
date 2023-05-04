import React, { useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";

export default function Projects() {

    return (
        <div className='projects-container'>
            <h3>Projects</h3>
            <Link to='new'>New Project</Link>
            <Outlet />
        </div>
    )
}