import React from 'react';
import { useParams, Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil';
import { selectedProject, userProjectsAtom } from '../recoil/state';
import KanbanBoard from './KanbanBoard';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function Project() {

    let { projectId } = useParams();
    const projects = useRecoilValue(userProjectsAtom);

    const currentProject = projects.filter(project => project.id == projectId)[0];

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

    function handleTaskSubmit(vals) {
        fetch('/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vals)
        })
        .then(res => res.json())
        .then(data => console.log(data))
    }

    return (
        <div className='project-card'>
            <h3>{currentProject.title}</h3>
            <span>
                <div className='kanban container'>
                    <KanbanBoard project={currentProject}/>
                </div>
                <div className='project-buttons'>
                    <Formik
                    initialValues={initialValues}
                    validationSchema={formSchema}
                    onSubmit= {handleTaskSubmit}
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
                    </Formik>
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