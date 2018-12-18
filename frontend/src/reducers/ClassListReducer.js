import {ADD_CLASS, EDIT_CLASS, REMOVE_CLASS} from "../actions/ClassInputActions";

export default function ClassList(state = {
    // selectedClasses is a dictionary from uid to class
    selectedClasses: {},
}, action) {
    let copy = null;
    switch (action.type) {
        case ADD_CLASS:
            copy = Object.assign({}, state.selectedClasses);
            copy[Object.keys(copy).length] = action.newClass;
            return Object.assign({}, state, {selectedClasses: copy});
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
