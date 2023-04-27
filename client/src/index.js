import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import RecoilRoot from 'recoil'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Router>
        <RecoilRoot>
            <App />
        </RecoilRoot>
    </Router>
)