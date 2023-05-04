import React from 'react';
import { useParams, Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil';
import { selectedProject, userProjectsAtom } from '../recoil/state';
import KanbanBoard from './KanbanBoard';

export default function Project() {

    let { projectId } = useParams();
    const projects = useRecoilValue(userProjectsAtom);

    const currentProject = projects.filter(project => project.id == projectId)[0];

    return (
        <div className='project-card'>
            <h3>{currentProject.title}</h3>
            <div className='kanban container'>
                <KanbanBoard project={currentProject}/>
            </div>
            <div className='next-five-days'>
                <span className='week-calendar'>
                    <div className='day-one'></div>
                    <div className='day-two'></div>
                    <div className='day-three'></div>
                    <div className='day-four'></div>
                    <div className='day-five'></div>
                    <div className='day-six'></div>
                    <div className='day-seven'></div>
                </span>
            </div>

            <Link to='..'><p>Go Back</p></Link>
        </div>
    )
}