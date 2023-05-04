import React from 'react';
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil';
import { userProjectsAtom } from '../recoil/state'

export default function ProjectList() {

    const pList = useRecoilValue(userProjectsAtom)
    console.log(pList)

    const projects = pList.map((project) => {

        const todoList = Array(...project.todos)
        const nextDue = todoList.sort((a, b) => {return Date.parse(b.due_date) - Date.parse(a.due_date)})[0];

        return (
            <tr key={project.title+project.id}>
                <td>{project.title}</td>
                <td>{nextDue? nextDue.title : 'None'}</td>
                <td>{nextDue? nextDue.status : 'N/A'}</td>
                <td>{nextDue? nextDue.due_date : 'N/A'}</td>
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
                        <th>Status</th>
                        <th>Due Date</th>
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