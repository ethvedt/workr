import React, { useEffect } from "react";
import { Outlet, redirect } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userAtom, userTeamsAtom, userProjectsAtom } from '../recoil/state';
import NavBar from './NavBar.js';
import '../styles/App.css'

export default function App() {
  const [user, setUser] = useRecoilState(userAtom);
  const setTeams = useSetRecoilState(userTeamsAtom);
  const setProjects = useSetRecoilState(userProjectsAtom);


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
  }, [])

  useEffect(() => {
    fetch(`/users/${user.id}/projects`)
    .then(res => res.json())
    .then(p => setProjects(p));

    fetch(`/users/${user.id}/teams`)
    .then(res => res.json())
    .then(t => setTeams(t));
  }, [user]);


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
