import React, { useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom, userProjectsAtom } from '../recoil/state'

export default function Projects() {

    const user = useRecoilValue(userAtom);
    const [pList, setPList] = useRecoilState(userProjectsAtom);

    useEffect(() => {
        fetch(`/users/${user.id}/projects`)
        .then(res => res.json())
        .then(data => {

            if (data !== pList) {
                setPList(data)
            }
        })
    }, [user])

    return (
        <div className='projects-container'>
            <h3>Projects</h3>
            <Link to='new'>New Project</Link>
            <Outlet />
        </div>
    )
}