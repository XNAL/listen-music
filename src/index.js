import React from 'react';
import ReactDOM from 'react-dom';
import './styles/app.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
