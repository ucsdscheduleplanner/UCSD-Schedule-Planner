import {
    RECEIVE_CLASS_PER_DEPARTMENT, RECEIVE_DEPARTMENTS, REQUEST_CLASS_PER_DEPARTMENT,
    REQUEST_DEPARTMENTS
} from "../actions/ClassInputActions";

export default function ClassInput(state = {requesting: false,
    departments: [], classes: [], instructorsPerClass: [], classTypesPerClass: []}, action) {
    switch (action.type) {
        case RECEIVE_DEPARTMENTS:
            return Object.assign({}, state, {
                departments: action.departments,
                requesting: action.requesting
            });
        case REQUEST_DEPARTMENTS:
            return Object.assign({}, state, {
                requesting: action.requesting
            });
        case REQUEST_CLASS_PER_DEPARTMENT:
            return Object.assign({}, state, {
                requesting: action.requesting
            });
        case RECEIVE_CLASS_PER_DEPARTMENT:
            return Object.assign({}, state, {
                requesting: action.requesting,
                classes: action.classes,
                instructorsPerClass: action.instructorsPerClass,
                classTypesPerClass: action.classTypesPerClass
            });
        default:
            return state;
    }
}


