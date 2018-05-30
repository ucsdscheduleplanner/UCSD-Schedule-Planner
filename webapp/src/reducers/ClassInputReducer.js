import {
    RECEIVE_CLASS_PER_DEPARTMENT, RECEIVE_DEPARTMENTS, REQUEST_CLASS_PER_DEPARTMENT,
    REQUEST_DEPARTMENTS, SET_CONFLICTS, SET_CURRENT_COURSE_NUM, SET_CURRENT_DEPARTMENT, SET_CURRENT_INSTRUCTOR,
    SET_EDIT_MODE,
    SET_PRIORITY
} from "../actions/ClassInputActions";

export default function ClassInput(state = {
    requesting: false,
    departments: [],
    // classes will be a dict where each value is an array of
    // classes and each key is a department
    classes: {},
    instructorsPerClass: {},
    classTypesPerClass: {},

    selectedConflicts: [],
    currentInstructor: null,
    currentDepartment: null,
    currentCourseNum: null,
    priority: null,
    editMode: false,
    editUID: null,
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
            // getting department
            let newDepartment = action.department;
            // copying over
            let newClassDict = Object.assign({}, state.classes);
            // setting new department key to classes
            newClassDict[newDepartment] = action.classes;
            let newInstructorDict = Object.assign({}, state.instructorsPerClass);
            newInstructorDict[newDepartment] = action.instructorsPerClass;

            let newClassTypeDict = Object.assign({}, state.classTypesPerClass);
            newClassTypeDict[newDepartment] = action.classTypesPerClass;

            return Object.assign({}, state, {
                requesting: action.requesting,
                classes: newClassDict,
                instructorsPerClass: newInstructorDict,
                classTypesPerClass: newClassTypeDict
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
        case SET_EDIT_MODE:
            return Object.assign({}, state, {
                editMode: action.editMode,
                editUID: action.editUID
            });
        default:
            return state;
    }
}


