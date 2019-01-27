import {ADD_CLASS, EDIT_CLASS, REMOVE_CLASS} from "../actions/classinput/ClassInputActions";

export default function ClassList(state = {
    // selectedClasses is a dictionary from uid to class
    selectedClasses: {},

    // almost like an arraylist, holds the number of spaces allocated so far, not necessarily the number of occupied spaces
    bufferSize: 0,
}, action) {
    let copy = null;
    switch (action.type) {
        case ADD_CLASS:
            copy = Object.assign({}, state.selectedClasses);
            // getting position based if an ID was passed along
            let pos = action.transactionID ? action.transactionID : state.bufferSize;
            copy[pos] = action.newClass;
            return Object.assign({}, state, {selectedClasses: copy, bufferSize: state.bufferSize + 1});
        case EDIT_CLASS:
            copy = Object.assign({}, state.selectedClasses);
            copy[action.transactionID] = action.editClass;
            return Object.assign({}, state, {selectedClasses: copy});
        case REMOVE_CLASS:
            copy = Object.assign({}, state.selectedClasses);
            delete copy[action.transactionID];
            console.log(copy);
            return Object.assign({}, state, {selectedClasses: copy});
        default:
            return state;
    }
};
