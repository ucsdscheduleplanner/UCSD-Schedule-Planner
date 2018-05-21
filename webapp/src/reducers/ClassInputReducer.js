import {
    RECEIVE_CLASS_PER_DEPARTMENT, RECEIVE_DEPARTMENTS, REQUEST_CLASS_PER_DEPARTMENT,
    REQUEST_DEPARTMENTS, SET_CONFLICTS, SET_CURRENT_COURSE_NUM, SET_CURRENT_DEPARTMENT, SET_CURRENT_INSTRUCTOR,
    SET_PRIORITY
} from "../actions/ClassInputActions";

export default function ClassInput(state = {
    requesting: false,
    departments: [],
    classes: [],
    instructorsPerClass: [],
    classTypesPerClass: [],

    selectedConflicts: [],
    currentInstructor: null,
    currentDepartment: null,
    currentCourseNum: null,
    priority: null,
}, action) {
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
        case SET_CURRENT_COURSE_NUM:
            return Object.assign({}, state, {
                currentCourseNum: action.currentCourseNum
            });
        case SET_CURRENT_DEPARTMENT:
            return Object.assign({}, state, {
                currentDepartment: action.currentDepartment
            });
        case SET_CURRENT_INSTRUCTOR:
            return Object.assign({}, state, {
                currentInstructor: action.currentInstructor
            });
        case SET_PRIORITY:
            return Object.assign({}, state, {
                priority: action.priority
            });
        case SET_CONFLICTS:
            return Object.assign({}, state, {
                conflicts: action.conflicts
            });
        default:
            return state;
    }
}


