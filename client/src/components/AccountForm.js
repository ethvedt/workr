import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';

export default function AccountForm({ handleSubmit }) {

    const formSchema = yup.object().shape({
        username: yup.string()
            .min(4, 'Username is too short.')
            .max(32, 'Username is too long.')
            .required('Username is required.')
            .matches('/^[a-z0-9]+$/i', 'Must use letters and numbers only.'),
        password: yup.string()
            .min(8, 'Password is too short.')
            .max(255, 'Password is too long.')
            .required('Password is required.')
    });

    const initialValues = {
        username: '',
        password: '',
    };


    return (
    <Formik 
        initialValues={initialValues}
        validationSchema={formSchema}
        onSubmit={handleSubmit}
    >
        {(formik) =>{
            return(
                <Form>
                    <label htmlFor='username'>Username</label>
                    <Field id='username' name='username' />

                    <label htmlFor='password'>Password</label>
                    <Field id='password' name='password' />

                    <button type='submit'>Submit</button>
                </Form>)
        }}
    </Formik>)

};