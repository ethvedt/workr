import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import AccountForm from './AccountForm';
import { userAtom, loggedIn } from '../recoil/state'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';


export default function Login() {
    const [user, setUser] = useRecoilState(userAtom);
    const loggedInBool = useRecoilValue(loggedIn)
    const [loginOrCreate, setLoginOrCreate] = useState(true);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const navigate = useNavigate();

    const formSchemaUsername = yup.object().shape({
        username: yup.string()
            .min(4, 'Username is too short.')
            .max(32, 'Username is too long.')
            .matches(/^[a-z0-9]+$/i, 'Must use letters and numbers only.'),
    })

    function handleLogin(vals) {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(vals)
        })
        .then((res) => res.json())
        .then((user) => {
            setUser(user);
        })
    };

    function handleCreateAccount(vals) {
        fetch('/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(vals)
        })
        .then((res) => {
            if (res.ok) {
                res.json().then( data => {
                    setUser({
                        username: data.username,
                        id: data.id
                    });
                })
            }
            else {
                alert(res.error)
            }
        })
    }
    
    function handleToggle(e) {
        setLoginOrCreate((prevState) => !prevState)
    }

    function handleDelete() {
        fetch(`/users/${user.id}`, {
            method: 'DELETE'
        })
        .then((res) => {
            if (res.ok) {
                setUser({id: null, username: null})
            }
            else {
                alert(res.error)
            }
        })
    }

    if (loggedInBool) {
        return (
            <div>
                <h1>Welcome, {user.username}</h1>
                <Link to={'username'}>Change Username</Link>
                <Link to={'password'}>Change Password</Link>
                {() => {
                    deleteConfirmation ?
                    <button onClick={handleDelete}>Are you sure?</button> :
                    <button onClick={() => setDeleteConfirmation(true)}>Delete your account</button>
                }}
                <Outlet />
            </div>
        )
    }
    else {
        if (loginOrCreate) {
            return (
                <div className='login'>
                    <h3>Please log in to use Workr.</h3>
                    <AccountForm handleSubmit={handleLogin} />
                    <button onClick={handleToggle}>Create an account</button>
                </div> 
            )}
        return (
            <div className='create-account'>
                <h3>Create an account now.</h3>
                <AccountForm handleSubmit={handleCreateAccount} />
                <button onClick={handleToggle}>Log in</button>
            </div> 

        )
    }



}