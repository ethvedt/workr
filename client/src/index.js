import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import {RecoilRoot} from 'recoil';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));


const route = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        /* children: [
            {
                path: 'home',
                element: <Home />
            },
            {
                path: 'calendar',
                element: <Calendar />
            },
            {
                path: 'teams',
                element: <Teams />,
                children: [
                    {
                        path: ':teamId',
                        element: <Team />,
                        loader: async ({ params }) => {
                            return fetch(`/teams/${params.teamId}`).then(r => r.json());
                        }
                    }
                ]
            }
        ] */
    }
])

root.render(
    <React.StrictMode>
        <RecoilRoot>
            <RouterProvider router={route} />
        </RecoilRoot>
    </React.StrictMode>
)