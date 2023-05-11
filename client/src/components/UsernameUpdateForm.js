import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { userAtom } from '../recoil/state'


export default function UsernameUpdateForm() {

    const [user, setUser] = useRecoilState(userAtom);
    const [hidePassword, setHidePassword] = useState(true)
    const [hidePasswordConfirm, setHidePasswordConfirm] = useState(true)

    const formSchema = yup.object().shape({
        username: yup.string()
            .min(4, 'Username is too short.')
            .max(32, 'Username is too long.')
            .required('Username is required.')
            .matches(/^[a-z0-9]+$/i, 'Must use letters and numbers only.'),
        password: yup.string()
            .min(4, 'Password is too short.')
            .max(255, 'Password is too long.')
            .required('Password is required.'),
        passwordConfirm: yup.string()
            .required('Please retype your password.')
            .oneOf([yup.ref('password')], 'Your passwords do not match.')
    });

    const initialValues = {
        username: '',
        password: '',
        passwordConfirm: '',
    };

    function handleToggleHidePassword(e) {
        const currentState = hidePassword;
        setHidePassword((prevState) => !prevState);
    }

    function handleToggleHidePasswordConfirm(e) {
        setHidePasswordConfirm((prevState) => !prevState);
    }
    
    function handleSubmit(vals) {
        fetch(`/users/${user.id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(vals)
        })
        .then(res => {
            if (res.ok) {
                return res.json()
                .then(user => setUser({id: user.id, username: user.username}))
            }
            alert(res.error);
        })
    }

    return (
    <Formik 
        initialValues={initialValues}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
    >
        {(props) =>{
            return(
                <Form>
                    <label htmlFor='username'>New Username</label>
                    <Field id='username' name='username' />
                    <ErrorMessage name='username' />

                    <label htmlFor='password'>Password</label>
                    <Field id='password' name='password' type={hidePassword ? 'password' : 'text'}/>
                    <button type='button' onClick={handleToggleHidePassword}>{hidePassword ? 'Show Password' : 'Hide Password'}</button>
                    <ErrorMessage name='password' />

                    <label htmlFor='passwordConfirm'>Confirm Password</label>
                    <Field id='passwordConfirm' name='passwordConfirm' type={hidePassword ? 'password' : 'text'}/>
                    <button type='button' onClick={handleToggleHidePasswordConfirm}>{hidePassword ? 'Show Password' : 'Hide Password'}</button>
                    <ErrorMessage name='passwordConfirm' />

                    <button>Submit</button>
                </Form>)
        }}
    </Formik>)

};