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
import NewProjectForm from './components/NewProjectForm';
import UsernameUpdateForm from './components/UsernameUpdateForm';
import PasswordUpdateForm from './components/PasswordUpdateForm';
import NewTeamForm from './components/NewTeamForm';

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
                    },
                    {
                        path: 'new',
                        element: <NewTeamForm />
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
                        path: 'new',
                        element: <NewProjectForm />
                    },
                    {
                        path: ':projectId',
                        element: <Project />,
                    }
                ]
            },
            {
                path: 'login',
                element: <Login />,
                children: [
                    {
                        path: 'username',
                        element: <UsernameUpdateForm />
                    },
                    {
                        path: 'password',
                        element: <PasswordUpdateForm />
                    }
                ]
            }
        ]
    }
])

root.render(
        <RecoilRoot>
            <RouterProvider router={route} />
        </RecoilRoot>
)