import React from 'react';
import ReactDOM from 'react-dom';
import Landing from './Landing.js'
import registerServiceWorker from './registerServiceWorker';
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import reducers from './reducers/index';
import './settings';
import './css/utils.css';
import thunkMiddleware from 'redux-thunk';
import {SGMiddleWare} from "./utils/SGMiddleWare";
import {NewLanding} from "./components/landing/NewLanding";

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
    (function() {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
            return this.replace(rtrim, '');
        };
    })();
}



const store = createStore(reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunkMiddleware, SGMiddleWare));

document.title = "Plan Your Schedule!";
// ReactDOM.render(
//     <Provider store={store}>
//         <Landing/>
//     </Provider>
//     , document.getElementById('root'));

ReactDOM.render(
    <Provider store={store}>
        <NewLanding/>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
