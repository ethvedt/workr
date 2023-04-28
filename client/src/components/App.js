import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import NavBar from './NavBar.js';

function App() {
  return (
    <>
      <span id='top-bar'>
        <h1>Workr</h1>
        <NavBar />
      </span>
      <div id='body'>
        This is the body.``
      </div>
    </>
  )

}

export default App;
