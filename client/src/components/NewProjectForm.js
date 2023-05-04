import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userProjectsAtom, teamSelectList, userAtom, userTeamsAtom } from '../recoil/state';
import Select from 'react-select';


function FormikSelect({ options, field, form, isMulti=false }) {

    function handleChange(option) {
        form.setFieldValue(field.name, option ? (option).map((item) => item.value) : [])
    }

    function getValue() {
        if (options) {
            return isMulti ? options.filter(o => o.value === field.value.indexOf(o.value)) >= 0 : options.find(o => o.value === field.value)
        } 
        else {
            return isMulti ? [] : '';
        }
    };

    if(isMulti) {
        return (
            <Select 
                name={field.name}
                value={getValue}
                options={options}
                onChange={handleChange}
                isMulti={true}
            />
        )
    }
    else {
        return (
            <Select 
            name={field.name}
            value={getValue}
            options={options}
            onChange={handleChange}
            />
            )
    }
}

export default function NewProjectForm() {
    
    const [projects, setProjects] = useRecoilState(userProjectsAtom);
    const teams = useRecoilValue(teamSelectList);
    const user = useRecoilValue(userAtom);
    const [userTeams, setUserTeam] = useRecoilState(userTeamsAtom);
    const [users, setUsers] = useState([]);
    const [userOpts, setUserOpts] = useState([]);
    const [teamOpts, setTeamOpts] = useState([]);
    
    const roleList = ['owner', 'senior', 'junior'];
    
    useEffect(() => {
        fetch('/users')
        .then(res => res.json())
        .then(users => {
            setUsers(users);
            //users?.map(user => setUserOpts([...userOpts, {value: user, label: user.username}]));
        });
    });

    useEffect(() => {
        if (userTeams === []){
            fetch(`/users/${user.id}/teams`)
            .then(res => res.json())
            .then(t => {
                setUserTeam(t)
                teams?.forEach(team => setTeamOpts([...teamOpts, {value: team, label: team.name}]));
            })
        }
    })

    const formSchema = yup.object().shape({
        title: yup.string().required(),
        team: yup.object({
            id: yup.number().required(),
            name: yup.string().required(),
            company: yup.string().required()
        }),
        users: yup.array(yup.object({
            id: yup.number().required(),
            username: yup.string().required(),
            user_role: yup.string().required().matches(/(owner|senior|junior)/i)
        }))

    })

    const initialValues = {
        title: '',
        team: {
            id: null,
            name: '',
            company: ''
        },
        users: []
    }

    function handleSubmit(vals) {
        console.log(vals)
    }

    return (
        <div>
            <h3>New Project</h3>
            <Select options={userOpts} />
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
                            isMulti={false} 
                            options={teamOpts}
                        />
                        <p>Or</p>
                        <label htmlFor='users'>Add Users</label>
                        <Field 
                            id='users'
                            name='users'
                            component={FormikSelect}
                            isMulti={true}
                            options={userOpts}
                        />
                    </Form>

                )}
            </Formik>
            <Link to='..'>Go Back</Link>
        </div>
    )
}