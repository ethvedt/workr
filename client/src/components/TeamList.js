import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { userTeamsAtom, userProjectsAtom, userAtom } from '../recoil/state';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';

function UserForm({ teamId, users, method }) {
    const user = useRecoilValue(userAtom);
    const [tList, setTeams] = useRecoilState(userTeamsAtom);
    const setProjects = useSetRecoilState(userProjectsAtom);

    const formSchemaPost = yup.object().shape({
        user_id: yup.number('Must select a user.'),
        user_role: yup.string()
    });

    const formSchemaDel = yup.object().shape({
        user_id: yup.number('Must select a user.')
    });

    const initialValuesPost = {
        user_id: '',
        user_role: ''
    };

    const initialValuesDel = {
        user_id: ''
    };


    function handleSubmit(vals, method) {
        switch (method) {
            case 'post':
                fetch(`/teams/${teamId}/members`, {
                    method: 'POST',
                    headers: { 'Content-type' : 'application/json'},
                    body: JSON.stringify(vals)
                })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    }
                    return res.json().then(res => {throw new Error(res.error)})
                })
                .then(team => {
                    const tListCopy = structuredClone(tList);
                    const tToReplace = tList.find(t => t.id == team.id);
                    tListCopy.splice(tListCopy.indexOf(tToReplace), 1, team);
                    setTeams(tListCopy)})
                .then(fetch(`/users/${user.id}/projects`)
                        .then(res => res.json())
                        .then(p => setProjects(p))
                    )
                .catch((error) => alert(error.message))
                break;
            case 'delete':
                fetch(`/teams/${teamId}/members`, {
                    method: 'DELETE',
                    headers: { 'Content-Type' : 'application/json'},
                    body: JSON.stringify(vals)
                })
                .then(res => res.json())
                .then((team) => {
                    const tListCopy = structuredClone(tList);
                    const [tReplace] = tListCopy.filter(t => t.id == team.id);
                    const tIndex = tListCopy.indexOf(tReplace);
                    tListCopy.splice(tIndex, 1, team);
                    setTeams(tListCopy);
                })
        }
    };
    if (method == 'post') {
        return (
            <Formik
                initialValues={initialValuesPost}
                validationSchema={formSchemaPost}
                onSubmit= {(vals) => handleSubmit(vals, method)}
            >
                {props => (
                    <Form>
                        <label htmlFor='user_id'>User</label>
                        <Field id='user_id' name='user_id' as='select'>
                            {users.map(user => {
                                return (<option key={user.id} value={user.id}>{user.username}</option>)
                            })}
                        </Field>
                        <ErrorMessage name='user' />

                        <label htmlFor='user_role'>User Role</label>
                        <Field id='user_role' name='user_role' as='select' >
                            <option value='owner'>Owner</option>
                            <option value='manager'>Manager</option>
                            <option value='senior'>Senior</option>
                            <option value='junior'>Junior</option>
                        </Field>
                        <ErrorMessage name='user_role' />
                        <button type='submit'>Submit</button>
                    </Form>
                )}
            </Formik>)
    }
    else if (method == 'delete') {
        return (
            <Formik
                initialValues={initialValuesDel}
                validationSchema={formSchemaDel}
                onSubmit= {(vals) => handleSubmit(vals, method)}
            >
                {props => (
                    <Form>
                        <label htmlFor='user_id'>User</label>
                        <Field id='user_id' name='user_id' as='select'>
                            {users.map(user => {
                                return (<option key={user.id} value={user.id}>{user.username}</option>)
                            })}
                        </Field>
                        <ErrorMessage name='user' />

                        <button type='submit'>Submit</button>
                    </Form>
                )}
            </Formik>)
    }
}


export default function TeamList() {
    const currentUser = useRecoilValue(userAtom);
    const [tList, setTList] = useRecoilState(userTeamsAtom);
    const [pList, setPlist] = useRecoilState(userProjectsAtom);
    const [allUsers, setAllUsers] = useState([]);
    const [addUserVis, setAddUserVis] = useState({});
    const [delUserVis, setDelUserVis] = useState({});
    const [deleteButton, setDeleteButton] = useState({});


    useEffect(() => {
        fetch('/users')
        .then(res => res.json())
        .then((data) => {
            setAllUsers(data);
        });
    },[])

    function handleTeamDelete(teamId) {
        fetch(`/teams/${teamId}`, {
            method: 'DELETE'
        })
        .then(res => {
            if (res.ok) {
                const tCopy = structuredClone(tList);
                const tToDel = tCopy.find(t => t.id == teamId);
                const tToDelIndex = tCopy.indexOf(tToDel);
                tCopy.splice(tToDelIndex, 1);
                setTList(tCopy);

                const pCopy = structuredClone(pList);
                const pDelList = pCopy.filter(p => p.team_id == teamId)
                for (const p of pDelList) {
                    pCopy.splice(pCopy.indexOf(p), 1);
                }
                setPlist(pCopy);
            }
        })
    }

    const team_projects = tList.map((team) => {
        // setAddUserVis((prevState) => ({...prevState, [team.id]: false}))
        // setDelUserVis((prevState) => ({...prevState, [team.id]: false}))
        const teamUsers = structuredClone(team.users).sort((a,b) => {
            const roleList = ['junior', 'senior', 'manager', 'owner'];
            const aIndex = roleList.indexOf(team.team_members.find(tm => tm.user_id == a.id).user_role);
            const bIndex = roleList.indexOf(team.team_members.find(tm => tm.user_id == b.id).user_role);
            return bIndex - aIndex;
        }).map((user) => {
            const userRole = team.team_members.find(tm => tm.user_id == user.id).user_role;

            return (
                <p key={user.id}>{user.username}, {userRole}</p>
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
                    {(() => {
                        const userRole = team.team_members.find(tm => tm.user_id == currentUser.id).user_role;
                        if ( ['owner', 'manager'].includes(userRole) ) {
                            return (
                                <div className='team-buttons'>
                                    {addUserVis[team.id] ?
                                        <div>
                                            <UserForm teamId={team.id} users={allUsers} method='post'/> 
                                            <button onClick={(e) => {
                                                e.preventDefault();
                                                setAddUserVis((prevState) => ({...prevState, [team.id] : !prevState[team.id]}))
                                                }}
                                            >Close Form</button>
                                        </div> :
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            setAddUserVis((prevState) => ({...prevState, [team.id] : !prevState[team.id]}))
                                            }}
                                        >Add a User</button>
                                    }
                                    {delUserVis[team.id] ?
                                        <div>
                                        <UserForm teamId={team.id} users={team.users} method='delete'/> 
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            setDelUserVis((prevState) => ({...prevState, [team.id] : !prevState[team.id]}))
                                            }}
                                        >Close Form</button>
                                        </div>:
                                        <button onClick={(e) => {
                                            e.preventDefault();
                                            setDelUserVis((prevState) => ({...prevState, [team.id] : !prevState[team.id]}))
                                            }}
                                        >Remove a User</button>
                                    }
                                </div>
                            )
                        }
                    })()}

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
                {team.team_members.find(tm => tm.user_id == currentUser.id).user_role == 'owner' ? 
                deleteButton[team.id] ? 
                <button onClick={(e) => handleTeamDelete(team.id)}>Are you sure?</button> :
                <button onClick={(e) => setDeleteButton((p) => ({...p, [team.id] : !p[team.id]}))}>Delete this team.</button>
                 : null
                }
            </div>
        )
    });

    return (
        <div className='team-container'>
            {team_projects}
        </div>
    )
}