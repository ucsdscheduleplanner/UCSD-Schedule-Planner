import {VIEW_CLASS_TYPE_CODES} from "../actions/class_types/view/ViewClassTypesActions";

export default function ViewClassTypesReducer(state = {
    // maps class titles to what types are ignored for them
    classMapping: {}
}, action) {

    let copy;
    switch (action.type) {
        case VIEW_CLASS_TYPE_CODES:
            copy = Object.assign({}, state.classMapping);
            copy[action.classTitle] = action.typesToView;

            return Object.assign({}, state, {
                classMapping: copy
            });
        default:
            return state;
    }
}
