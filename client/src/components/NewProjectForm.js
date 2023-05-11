import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userProjectsAtom, teamSelectList, userAtom, userTeamsAtom, teamOpts } from '../recoil/state';

export default function NewProjectForm() {
    
    const [projects, setProjects] = useRecoilState(userProjectsAtom);
    const user = useRecoilValue(userAtom);
    const teamList = useRecoilValue(userTeamsAtom);
    const navigate = useNavigate();

    const formSchema = yup.object().shape({
        title: yup.string().required('You need a title for your project.'),
        team_id: yup.number().required('Must select a team.')
    })

    const teamOptsComponent = teamList?.map(team => {
        return (<option key={team.id} value={team.id}>{team.name}</option>)
    })

    const initialValues = {
        title: '',
        team_id: ''
    }

    function handleSubmit(vals) {
        fetch('/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vals)
        })
        .then(res => res.json())
        .then(project => setProjects((prevState) => [...prevState, project]))
        .then(navigate('..'))
    }

    return (
        <div>
            <h3>New Project</h3>
            <Formik 
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {props => (
                    <Form>
                        <label htmlFor='title'>Project Title</label>
                        <Field id='title' name='title' />
                        <ErrorMessage name='title' />

                        <label htmlFor='team_id'>Pick a Team</label>
                        <Field id='team_id' name='team_id' as='select'>
                            {teamOptsComponent}
                        </Field>
                        <button type='submit'>Submit</button>
                    </Form>

                )}
            </Formik>
            <Link to='..'>Go Back</Link>
        </div>
    )
}