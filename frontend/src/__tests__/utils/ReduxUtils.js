import {applyMiddleware, createStore} from "redux";
import reducers from "../../reducers";
import thunk from "redux-thunk";


export function getStore() {
    return createStore(reducers, applyMiddleware(thunk));}
