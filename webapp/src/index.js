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

const DEBUG = false;
if(!DEBUG){
    if(!window.console) window.console = {};
    const methods = ["log", "debug", "warn", "info"];
    for(let i=0;i<methods.length;i++){
        console[methods[i]] = function(){};
    }
}

String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

const store = createStore(reducers, applyMiddleware(thunkMiddleware));

document.title = "Plan Your Schedule!";
ReactDOM.render(
    <Provider store={store}>
        <Landing/>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
