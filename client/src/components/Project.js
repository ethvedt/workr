import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil';
import { selectedProject, userProjectsAtom } from '../recoil/state';
import KanbanBoard from './KanbanBoard';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


function TodoForm({ handleSubmit, projectId }) {

    const formSchema = yup.object().shape({
        title: yup.string().required(),
        due_date: yup.date().required().min(new Date(), 'Due date must be in the future.'),
        project_id: yup.number().required()
    });

    const initialValues = {
        title: '',
        due_date: new Date(),
        project_id: projectId
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={formSchema}
            onSubmit= {handleSubmit}
        >
            {props => (
                <Form>
                    <label htmlFor='title'>Task</label>
                    <Field id='title' name='title' />
                    <ErrorMessage name='title' />

                    <label htmlFor='due_date'>Due Date</label>
                    <Field id='due_date' name='due_date' component=
                        {props => {
                            return (
                                <DatePicker 
                                    selected={props.field.value}
                                    onChange={val => {
                                        props.form.setFieldValue('due_date', val);
                                    }}
                                    DateFormat='yyyy-MM-dd'
                                    placeholderText='Pick a date'
                                />
                            )
                        }}
                        />
                    <ErrorMessage name='due_date' />
                    <button type='submit'>Submit</button>
                </Form>
            )}
        </Formik>)
}

function UserForm({ handleSubmit, projectId, users }) {

    const formSchema = yup.object().shape({
        user: yup.string().required(),
        user_role: yup.string().required()
    });

    const initialValues = {
        user_id: '',
        user_role: ''
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={formSchema}
            onSubmit= {handleSubmit}
        >
            {props => (
                <Form>
                    <label htmlFor='user_id'>User</label>
                    <Field id='user_id' name='user_id' as='select'>
                        {users.map(user => {
                            return (<option key={user.id} value={user.id}>{user.name}</option>)
                        })}
                    </Field>
                    <ErrorMessage name='user' />

                    <label htmlFor='user_role'>User Role</label>
                    <Field id='user_role' name='user_role' as='select' placeholder='Pick a role...'>
                        <option value='senior'>Senior</option>
                        <option value='junior'>Junior</option>
                    </Field>
                    <ErrorMessage name='user_role' />
                    <button type='submit'>Submit</button>
                </Form>
            )}
        </Formik>)
}

export default function Project() {

    let { projectId } = useParams();
    const projects = useRecoilValue(userProjectsAtom);
    const [users, setUsers] = useState([]);
    const [taskButton, setTaskButton] = useState(false);
    const [userButton, setUserButton] = useState(false);
    const [currentProject, setCurrentProject] = useState(projects.filter(project => project.id == projectId)[0]);

    console.log(currentProject);
    function handleTaskSubmit(vals) {
        fetch('/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vals)
        })
        .then(res => res.json())
        .then(data => console.log(data))
    }

    function handleUserSubmit(vals) {
        fetch(`/projects/${projectId}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vals)
        })
        .then(res => res.json())
        .then(data => console.log(data))
    }

    return (
        <div className='project-card'>
            <h2>{currentProject.title}</h2>
            {(() => {
                const users = [];
                currentProject.users.map((user) => {
                    users.push(user.username)
                });
                return (<h3>{users.join(', ')}</h3>)
                })()
            }
            <span>
                <div className='kanban container'>
                    <KanbanBoard project={currentProject}/>
                </div>
                <div className='project-buttons'>
                    <div className='task-button-container'>
                        {taskButton ? 
                        <TodoForm handleSubmit={handleTaskSubmit} projectId={projectId}/> :
                        null}
                        <button onClick={(e) => {
                            e.preventDefault();
                            setTaskButton((prevState) => !prevState);
                            }}
                        >{taskButton ? 'Hide Form' :'Add Todo'}</button>
                    </div>
                    <div className='user-button-container'>
                        {userButton ? 
                            <UserForm handleSubmit={handleUserSubmit} projectId={projectId} users={users}/> :
                            null}
                        <button onClick={(e) => {
                            e.preventDefault();
                            setUserButton((prevState) => !prevState);
                            }}
                        >{userButton ? 'Hide Form' :'Add User'}</button>
                    </div>
                </div>
            </span>
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