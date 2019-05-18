/**
 Query the registry to get more information on classes
 **/
import {STORE_INSTRUCTORS, STORE_TYPES} from "../actions/class_registry/ClassRegistryActions";


export default function ClassRegistry(state = {
    instructors: {},
    types: {}
}, action) {
    let department = null;
    let courseNum = null;
    let classTitle = null;

    let copy = null;

    switch (action.type) {
        case STORE_TYPES:
            department = action.department;
            courseNum = action.courseNum;
            classTitle = `${department} ${courseNum}`;

            let types = action.types;

            copy = Object.assign({}, state.types);
            copy[classTitle] = types;

            return Object.assign({}, state, {types: copy});
        case STORE_INSTRUCTORS:
            department = action.department;
            courseNum = action.courseNum;
            classTitle = `${department} ${courseNum}`;

            let instructors = action.instructors;

            console.log(state.instructors);
            copy = Object.assign({}, state.instructors);
            copy[classTitle] = instructors;

            return Object.assign({}, state, {instructors: copy});
        default:
            return state;
    }
};
