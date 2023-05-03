import React from 'react';
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil';

export default function Project() {

    let { projectId } = useParams()

    if (isNaN(projectId)) {
        return (<></>)
    }

    return (
        <div className='project-card'>Project 1</div>
    )
}