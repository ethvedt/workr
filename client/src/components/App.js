import React, { useEffect } from "react";
import { Outlet, redirect } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { userAtom } from "../recoil/state.js";
import NavBar from './NavBar.js';

export default function App() {
  const [user, setUser] = useRecoilState(userAtom);


  useEffect(() => {
    fetch('/check_session')
    .then(r => {
      if (r.ok) {
         r.json().then(data => {
          if (data !== user) {
            setUser({
            id: data.id,
            username: data.username,
           })
          };
          if (user.id === null) {
            redirect('login');
          }
          else {
            redirect('home');
          }
        })
      }
      else {
        redirect('login');
      }
    })
  }, [user])


  return (
    <div>
      <div className='topbar'>
        <h1>Workr</h1>
        <NavBar />
      </div>
      <hr />
      <div className='body'>
        <Outlet />
      </div>
    </div>
  )

}
