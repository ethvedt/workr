import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import {RecoilRoot} from 'recoil';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import CalendarPage from './components/CalendarPage';
import Teams from './components/Teams';
import Team from './components/Team';
import TeamList from './components/TeamList';
import Projects from './components/Projects';
import ProjectList from './components/ProjectList';
import Project from './components/Project';
import Login from './components/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));


const route = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'home',
                element: <Home />
            },
            {
                path: 'calendar',
                element: <CalendarPage />
            },
            {
                path: 'teams',
                element: <Teams />,
                children: [
                    {
                        index: true,
                        element: <TeamList />

                    },
                    {
                        path: ':teamId',
                        element: <Team />,
                    }
                ]
            },
            {
                path: 'projects',
                element: <Projects />,
                children: [
                    {
                        index: true,
                        element: <ProjectList />

                    },
                    {
                        path: ':projectId',
                        element: <Project />,
                    }
                ]
            },
            {
                path: 'login',
                element: <Login />
            }
        ]
    }
])

root.render(
    <React.StrictMode>
        <RecoilRoot>
            <RouterProvider router={route} />
        </RecoilRoot>
    </React.StrictMode>
)