import React, { useState } from 'react';
import { redirect } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import AccountForm from './AccountForm';
import { userAtom, loggedIn } from '../recoil/state'


export default function Login() {
    const [user, setUser] = useRecoilState(userAtom);
    const loggedInBool = useRecoilValue(loggedIn)
    const [loginOrCreate, setLoginOrCreate] = useState(true);

    function handleLogin(vals) {
        console.log(vals);
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
                    redirect('/home');
                })
            }
            else {
                alert(res.error)
            }
        })
    }
    
    function handleToggle(e) {
        setLoginOrCreate(!loginOrCreate)
    }

    if (loggedInBool) {
        return (
            <h1>You are already logged in.</h1>
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