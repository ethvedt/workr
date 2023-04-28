import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import RecoilRoot from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Router>
            <RecoilRoot>
                <App />
            </RecoilRoot>
        </Router>
    </React.StrictMode>
)