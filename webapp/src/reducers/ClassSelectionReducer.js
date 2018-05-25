
/*
Each reducer has its own space in store under the name
So can access this reducer's state by doing state.ClassSelection
 */

// not including uuid in here in order to keep state shallow
import {EDIT_CLASS, REMOVE_CLASS} from "../actions/ClassInputActions";

export default function ClassSelection(state={}, action) {
    let copy = null;
    let uuid = null;
    switch(action.type) {
        case "ADD_CLASS":
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
        case "REMOVE_CONFLICT":
            uuid = parseInt(action.payload.uuid, 0);
            copy = Object.assign({}, state);
            copy[uuid].conflicts = copy[uuid].conflicts.filter(conflict => conflict !== action.payload.conflict);
            return copy;

        default:
            return state;
    }
};


