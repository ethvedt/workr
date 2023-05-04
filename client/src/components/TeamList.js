import React from 'react';
import { useRecoilValue } from 'recoil';
import { userTeamsAtom, userProjectsAtom } from '../recoil/state';

export default function TeamList() {

    const tList = useRecoilValue(userTeamsAtom);
    const pList = useRecoilValue(userProjectsAtom);

    const team_projects = tList.map((team) => {

        const teamUsers = team.users.map((user) => {
            return (
                <p key={user.username+team.name}>{user.username}</p>
            )
        });
        
        const projects = pList.map((project) => {

            const todoList = Array(...project.todos);
            const nextDue = todoList.sort((a, b) => {return Date.parse(b.due_date) - Date.parse(a.due_date)})[0];
            
            if (project.team.id === team.id) {
                return (
                <tr key={project.title}>
                    <td>{project.title}</td>
                    <td>{nextDue? nextDue.title : 'None'}</td>
                    <td>{nextDue? nextDue.status : 'N/A'}</td>
                    <td>{nextDue? nextDue.due_date : 'N/A'}</td>
                </tr>
                )
            } else {return null}
        })

        return (
            <div className='team-list' key={team.id}>
                <h3>{team.name}</h3>
                <p>{team.company}</p>
                <span>
                    {teamUsers}
                </span>
                <table>
                    <thead>
                        <tr>
                            <th>Projects</th>
                            <th>Next Due</th>
                            <th>Status</th>
                            <th>Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects}
                    </tbody>
                </table>
            </div>
        )
    });

    return (
        <div className='team-container'>
            {team_projects}
        </div>
    )
}