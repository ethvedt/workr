import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';

export default function AccountForm({ handleSubmit }) {

    const [hidePassword, setHidePassword] = useState(true)

    const formSchema = yup.object().shape({
        username: yup.string()
            .min(4, 'Username is too short.')
            .max(32, 'Username is too long.')
            .required('Username is required.')
            .matches(/^[a-z0-9]+$/i, 'Must use letters and numbers only.'),
        password: yup.string()
            .min(4, 'Password is too short.')
            .max(255, 'Password is too long.')
            .required('Password is required.')
    });

    const initialValues = {
        username: '',
        password: '',
    };

    function handleToggleHidePassword(e) {
        const currentState = hidePassword;
        setHidePassword(!currentState);
    }

    return (
    <Formik 
        initialValues={initialValues}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
    >
        {({ errors, touched }) =>{
            return(
                <Form>
                    <label htmlFor='username'>Username</label>
                    <Field id='username' name='username' />
                    <ErrorMessage name='username' />

                    <label htmlFor='password'>Password</label>
                    <Field id='password' name='password' type={hidePassword ? 'password' : 'text'}/>
                    <button type='button' onClick={handleToggleHidePassword}>{hidePassword ? 'Show Password' : 'Hide Password'}</button>
                    <ErrorMessage name='password' />

                    <button>Submit</button>
                </Form>)
        }}
    </Formik>)

};