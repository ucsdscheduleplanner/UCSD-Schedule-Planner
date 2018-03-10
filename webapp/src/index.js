import React from 'react';
import ReactDOM from 'react-dom';
import Landing from './Landing.js'
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css'
import 'react-week-calendar/dist/style.css';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from './reducers/index'

const store = createStore(reducers);

document.title = "Plan Your Schedule!";
ReactDOM.render(
    <Provider store={store}>
        <Landing/>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
