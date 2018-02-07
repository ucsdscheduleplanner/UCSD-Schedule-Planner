import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Landing from './Landing.js'
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css'

ReactDOM.render(<Landing/>, document.getElementById('root'));
registerServiceWorker();
