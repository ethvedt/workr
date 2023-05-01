import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import AccountForm from './AccountForm';
import { userAtom } from '../recoil/state'


export default function Login() {
    const [user, setUser] = useRecoilState(userAtom);
    const [loginOrCreate, setLoginOrCreate] = useState(true);

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
                res.json().then()
            }
        })
    }
    
    function handleToggle(e) {
        setLoginOrCreate(!loginOrCreate)
    }

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