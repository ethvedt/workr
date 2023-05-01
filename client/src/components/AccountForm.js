import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';

export default function AccountForm({ handleSubmit }) {

    const formSchema = yup.object().shape({
        username: yup.string()
            .min(4, 'Username is too short.')
            .max(32, 'Username is too long.')
            .required('Username is required.')
            .test(
                'is-alnum',
                `$Username must not contain any special characters.`,
                (val, context) => {return val.isalnum()},
            ),
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
        validate={formSchema}
        onSubmit={handleSubmit}
    >
        <Form>
            <label htmlfor='username'>Username</label>
            <Field id='username' name='username' />

            <label htmlfor='password'>Password</label>
            <Field id='password' name='password' />

            <button type='submit'>Submit</button>
        </Form>
    </Formik>)

};