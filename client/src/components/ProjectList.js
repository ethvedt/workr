import React from 'react';
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil';
import { userProjectsAtom } from '../recoil/state'

export default function ProjectList() {

    const pList = useRecoilValue(userProjectsAtom)

    const projects = pList.map((project) => {

        const nextDue = project.todos.sort((a, b) => {return Date.parse(b.created_at) - Date.parse(a.created_at)})[0];

        return (
            <tr key={project.title}>
                <td>{project.title}</td>
                <td>{nextDue? nextDue.title : 'None'}</td>
                <td>{nextDue? nextDue.progress : 'N/A'}</td>
                <td>
                    <Link to={`${project.id}`}>View Details</Link> 
                </td>
            </tr>
        )
    })

    return (
        <div className='project-list'>
            <table>
                <thead>
                    <tr>
                        <th>Projects</th>
                        <th>Next Due</th>
                        <th>Progress</th>
                        <th>Expand</th>
                    </tr>
                </thead>
                <tbody>
                    {projects}
                </tbody>
            </table>
        </div>
    )
}