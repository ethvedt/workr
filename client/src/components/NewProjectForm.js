import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userProjectsAtom, teamSelectList, userAtom, userTeamsAtom, teamOpts } from '../recoil/state';
import Select from 'react-select';


function FormikSelect({ options, field, form }) {

    function handleChange(value) {
        console.log(value)
        form.handleChange(value)
    }

    function getValue() {
        if (options) {
            return options.find(o => o.value === field.value)
        } 
        else {
            return '';
        }
    };

    return (
        <Select 
        name={field.name}
        value={getValue}
        options={options}
        onChange={handleChange}
        />
        )
    
}

export default function NewProjectForm() {
    
    const [projects, setProjects] = useRecoilState(userProjectsAtom);
    const teams = useRecoilValue(teamSelectList);
    const user = useRecoilValue(userAtom);
    const [userTeams, setUserTeam] = useRecoilState(userTeamsAtom);
    const teamOptsList = useRecoilState(teamOpts);
    
    useEffect(() => {
        fetch(`/users/${user.id}/teams`)
        .then(res => res.json())
        .then(t => {
            console.log(t)
            setUserTeam(t)
        })
    }, [])

    const formSchema = yup.object().shape({
        title: yup.string().required(),
        team: yup.object({
            id: yup.number().required(),
            name: yup.string().required(),
            company: yup.string().required()
        })
    })

    const initialValues = {
        title: '',
        team: {
            id: null,
            name: '',
            company: ''
        }
    }

    function handleSubmit(vals) {
        console.log(vals)
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
                        <ErrorMessage name='username' />

                        <label htmlFor='team'>Pick a Team</label>
                        <Field 
                            id='team' 
                            name='team' 
                            component={FormikSelect} 
                            options={teamOptsList}
                        />
                    </Form>

                )}
            </Formik>
            <Link to='..'>Go Back</Link>
        </div>
    )
}