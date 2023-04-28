import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import NavBar from './NavBar.js';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userAtom } from "../recoil/state.js";

function App() {
  const [user, setUser] = useRecoilState(userAtom);


  useEffect(() => {
    fetch('/check_session')
    .then(r => {
      if (r.ok) {
         r.json().then(data => setUser({
          id: data.id,
          username: data.username,
         }))
      }
    })
  }, [])


  return (
    <>
      <span id='topbar'>
        <h1>Workr</h1>
        <NavBar />
      </span>
      <hr />
      <div id='body'>
        <Switch>

        </Switch>
      </div>
    </>
  )

}

export default App;
