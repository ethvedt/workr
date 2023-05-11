import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userProjectsAtom, teamSelectList, userAtom, userTeamsAtom } from '../recoil/state';

export default function NewTeamForm() {
    
    const [teams, setTeams] = useRecoilState(userTeamsAtom);
    const user = useRecoilValue(userAtom);
    const teamList = useRecoilValue(userTeamsAtom);
    const navigate = useNavigate();

    const formSchema = yup.object().shape({
        name: yup.string().required('You need a name for your team.'),
        company: yup.string().required('You must provide a company name.')
    })

    const initialValues = {
        name: '',
        company: ''
    }

    function handleSubmit(vals) {
        fetch('/teams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vals)
        })
        .then(res => {
            if (res.ok) {
                return res.json()
                    .then(team => setTeams((prevState) => [...prevState, team]))
                    .then(navigate('..'))
            }
            else {
                alert(res.error)
            }
        })
    }

    return (
        <div>
            <h3>New Team</h3>
            <Formik 
                initialValues={initialValues}
                validationSchema={formSchema}
                onSubmit={handleSubmit}
            >
                {props => (
                    <Form>
                        <label htmlFor='name'>Team Name</label>
                        <Field id='name' name='name' />
                        <ErrorMessage name='name' />

                        <label htmlFor='company'>Company Name</label>
                        <Field id='company' name='company' />
                        <button type='submit'>Submit</button>
                    </Form>

                )}
            </Formik>
            <Link to='..'>Go Back</Link>
        </div>
    )
}