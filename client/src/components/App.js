import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userAtom, userTeamsAtom, userProjectsAtom, userTodosAtom } from '../recoil/state';
import NavBar from './NavBar.js';
import '../styles/App.css'

export default function App() {
  const [user, setUser] = useRecoilState(userAtom);
  const setTeams = useSetRecoilState(userTeamsAtom);
  const setProjects = useSetRecoilState(userProjectsAtom);
  const setTodos = useSetRecoilState(userTodosAtom);
  const navigate = useNavigate();


  useEffect(() => {
    if (user.id == null) {
      navigate('/')
    }
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
            navigate('login');
          }
          else {
            navigate('home');
          }
        })
      }
      else {
        navigate('login');
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
    
    fetch(`/users/${user.id}/todos`)
    .then(res => res.json())
    .then(td => setTodos(td));
    
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
