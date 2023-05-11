import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { userAtom } from '../recoil/state'


export default function PasswordUpdateForm() {

    const [user, setUser] = useRecoilState(userAtom);
    const [hidePassword, setHidePassword] = useState(true)
    const [hidePasswordConfirm, setHidePasswordConfirm] = useState(true)

    const formSchema = yup.object().shape({
        password: yup.string()
            .min(4, 'Password is too short.')
            .max(255, 'Password is too long.')
            .required('Password is required.'),
        passwordConfirm: yup.string()
            .required('Please retype your password.')
            .oneOf([yup.ref('password')], 'Your passwords do not match.')
    });

    const initialValues = {
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

                    <label htmlFor='password'>New Password</label>
                    <Field id='password' name='password' type={hidePassword ? 'password' : 'text'}/>
                    <button type='button' onClick={handleToggleHidePassword}>{hidePassword ? 'Show Password' : 'Hide Password'}</button>
                    <ErrorMessage name='password' />

                    <label htmlFor='passwordConfirm'>Confirm New Password</label>
                    <Field id='passwordConfirm' name='passwordConfirm' type={hidePassword ? 'password' : 'text'}/>
                    <button type='button' onClick={handleToggleHidePasswordConfirm}>{hidePassword ? 'Show Password' : 'Hide Password'}</button>
                    <ErrorMessage name='passwordConfirm' />

                    <button>Submit</button>
                </Form>)
        }}
    </Formik>)

};