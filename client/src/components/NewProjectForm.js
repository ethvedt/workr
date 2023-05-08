import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userProjectsAtom, teamSelectList, userAtom, userTeamsAtom, teamOpts } from '../recoil/state';

export default function NewProjectForm() {
    
    const [projects, setProjects] = useRecoilState(userProjectsAtom);
    const user = useRecoilValue(userAtom);
    const teamList = useRecoilValue(userTeamsAtom);

    const formSchema = yup.object().shape({
        title: yup.string().required('You need a title for your project.'),
        team: yup.object({
            id: yup.number().required(),
            name: yup.string().required(),
            company: yup.string().required()
        })
    })

    const teamOptsComponent = teamList?.map(team => {
        // const teamVal = {
        //     value: {
        //         id: team.id,
        //         name: team.name,
        //         company: team.company
        //     },
        //     label: team.name}

        return (<option key={team.id} value={team.id}>{team.name}</option>)
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
                        <ErrorMessage name='title' />

                        <label htmlFor='team'>Pick a Team</label>
                        <Field id='team' name='team' as='select'>
                            {teamOptsComponent}
                        </Field>
                    </Form>

                )}
            </Formik>
            <Link to='..'>Go Back</Link>
        </div>
    )
}