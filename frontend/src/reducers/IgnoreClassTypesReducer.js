import {IGNORE_CLASS_TYPE_CODES} from "../actions/ignoreclasstypes/IgnoreClassTypesActions";

export default function IgnoreClassTypesReducer(state = {

    // maps class titles to what types are ignored for them
    classMapping: {}
}, action) {

    let copy;
    switch (action.type) {
        case IGNORE_CLASS_TYPE_CODES:
            copy = Object.assign({}, state.classMapping);
            copy[action.classTitle] = action.typesToIgnore;

            return Object.assign({}, state, {
                classMapping: copy
            });
        default:
            return state;
    }
}