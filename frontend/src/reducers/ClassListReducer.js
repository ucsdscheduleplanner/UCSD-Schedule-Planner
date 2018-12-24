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
            copy[state.bufferSize] = action.newClass;
            return Object.assign({}, state, {selectedClasses: copy, bufferSize: state.bufferSize + 1});
        case EDIT_CLASS:
            copy = Object.assign({}, state.selectedClasses);
            copy[action.id] = action.editClass;
            return Object.assign({}, state, {selectedClasses: copy});
        case REMOVE_CLASS:
            let id = parseInt(action.id, 10);
            copy = Object.assign({}, state.selectedClasses);
            delete copy[id];
            return Object.assign({}, state, {selectedClasses: copy});
        default:
            return state;
    }
};
