
/*
Each reducer has its own space in store under the name
So can access this reducer's state by doing state.ClassSelection
 */

// not including uuid in here in order to keep state shallow
import {ADD_CLASS, EDIT_CLASS, REMOVE_CLASS} from "../actions/ClassInputActions";

export default function ClassSelection(state={}, action) {
    let copy = null;
    switch(action.type) {
        case ADD_CLASS:
            copy = Object.assign({}, state);
            copy[action.payload.uuid] = action.payload.add;
            return copy;
        case EDIT_CLASS:
            copy = Object.assign({}, state);
            copy[action.editUID] = action.editClass;
            return copy;
        case REMOVE_CLASS:
            let uid = parseInt(action.uid, 10);
            copy = Object.assign({}, state);
            delete copy[uid];
            return copy;
        default:
            return state;
    }
};


