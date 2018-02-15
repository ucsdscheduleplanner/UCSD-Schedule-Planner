import React from 'react';
import ReactDOM from 'react-dom';
import Landing from './Landing.js'
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css'
import 'react-week-calendar/dist/style.css';

document.title = "Plan Your Schedule!";
ReactDOM.render(<Landing/>, document.getElementById('root'));
registerServiceWorker();
