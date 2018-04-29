import React from 'react';
import ReactDOM from 'react-dom';
import Landing from './Landing.js'
import registerServiceWorker from './registerServiceWorker';
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'font-awesome/css/font-awesome.css';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from './reducers/index';
import './css/utils.css';

const store = createStore(reducers);

document.title = "Plan Your Schedule!";
ReactDOM.render(
    <Provider store={store}>
        <Landing/>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
