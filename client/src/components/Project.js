import React from 'react';
import { useParams, Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil';
import { selectedProject, userProjectsAtom } from '../recoil/state';
import { DragDropContext } from 'react-beautiful-dnd';

export default function Project() {

    let { projectId } = useParams()
    const projects = useRecoilValue(userProjectsAtom)
    const currentProject = useRecoilValue(selectedProject(projectId))



    return (
        <div className='project-card'>
            <h3>{currentProject.title}</h3>
            <div className='kanban-board container'>
                
            </div>

            <Link to='..'><p>Go Back</p></Link>
        </div>
    )
}