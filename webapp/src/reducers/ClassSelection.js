

/*
Each reducer has its own space in store under the name
So can access this reducer's state by doing state.ClassSelection
 */

// not including uuid in here in order to keep state shallow
export default function ClassSelection(state={}, action) {
    let copy = null;
    switch(action.type) {
        case "ADD_CLASS":
            copy = Object.assign({}, state);
            copy[action.payload.uuid] = action.payload.add;
            return copy;
        case "REMOVE_CLASS":
            let uuid = parseInt(action.payload.uuid);
            copy = Object.assign({}, state);
            delete copy[uuid];
            return copy;
        default:
            return state;
    }
};


