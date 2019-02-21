import React from 'react';
import ReactDOM from 'react-dom';

import registerServiceWorker from './registerServiceWorker';
import {applyMiddleware, compose, createStore} from 'redux';
import {SGMiddleWare} from "./utils/SGMiddleWare";
import {Provider} from 'react-redux';

import reducers from './reducers/index';
import './settings';
import './css/utils.css';
import thunkMiddleware from 'redux-thunk';
import NewLanding from "./components/landing/NewLanding";

const DEBUG = true;

if (!DEBUG) {
    if (!window.console) window.console = {};
    const methods = ["debug", "warn", "log"];
    for (let i = 0; i < methods.length; i++) {
        console[methods[i]] = function () {
        };
    }
}

if (!String.prototype.trim) {
    (function () {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        // eslint-disable-next-line
        String.prototype.trim = function () {
            return this.replace(rtrim, '');
        };
    })();
}

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const store = createStore(reducers,
    composeEnhancer(applyMiddleware(thunkMiddleware, SGMiddleWare)));

document.title = "Plan Your Schedule!";
ReactDOM.render(
    <Provider store={store}>
        <NewLanding/>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
