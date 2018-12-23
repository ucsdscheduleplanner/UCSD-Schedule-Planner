import {POPULATE_DATA_PER_CLASS} from "../actions/ClassInput/ClassInputActions";
import {SET_COURSE_NUMS} from "../actions/ClassInput/ClassInputMutator";
import {SET_COURSE_NUM} from "../actions/ClassInput/ClassInputMutator";
import {SET_DEPARTMENT} from "../actions/ClassInput/ClassInputMutator";
import {SET_DEPARTMENTS} from "../actions/ClassInput/ClassInputMutator";
import {SET_INSTRUCTOR} from "../actions/ClassInput/ClassInputMutator";
import {SET_PRIORITY} from "../actions/ClassInput/ClassInputMutator";
import {SET_CONFLICTS} from "../actions/ClassInput/ClassInputMutator";
import {SET_EDIT_MODE} from "../actions/ClassInput/ClassInputMutator";
import {SET_MESSAGE_HANDLER} from "../actions/ClassInput/ClassInputMutator";
import {SET_INSTRUCTORS} from "../actions/ClassInput/ClassInputMutator";
import {SET_TYPES} from "../actions/ClassInput/ClassInputMutator";
import {SET_EDIT_OCCURRED} from "../actions/ClassInput/ClassInputMutator";
import {SET_ID} from "../actions/ClassInput/ClassInputMutator";
import {ConsoleMessageHandler} from "../utils/message/ConsoleMessageHandler";

export default function ClassInputReducer(state = {
    departments: [],
    courseNums: [],
    instructors: [],
    conflicts: [],
    types: [],

    instructorsPerClass: {},
    classTypesPerClass: {},
    descriptionsPerClass: {},

    instructor: null,
    department: null,
    courseNum: null,
    priority: null,
    editMode: false,
    editOccurred: false,
    // default is console message handler, but can be set to something else if needed
    messageHandler: new ConsoleMessageHandler(),

    // id of the current class - really only for Class editing purposes
    // if id is null that just means it hasn't been set yet, only set when edit mode is activated
    id: null
}, action) {
    switch (action.type) {
        case POPULATE_DATA_PER_CLASS:
            return Object.assign({}, state, {
                instructorsPerClass: action.instructorsPerClass,
                descriptionsPerClass: action.descriptionsPerClass,
                classTypesPerClass: action.classTypesPerClass
            });
        case SET_COURSE_NUMS:
            return Object.assign({}, state, {
                courseNums: action.courseNums
            });
        case SET_DEPARTMENTS:
            return Object.assign({}, state, {
                departments: action.departments
            });
        case SET_INSTRUCTORS:
            if(!action.instructors)
                action.instructors = [];
            return Object.assign({}, state, {
                instructors: action.instructors
            });
        case SET_TYPES:
            if(!action.types)
                action.types = [];

            let types = action.types.filter((classType) => {
                return classType["label"] !== "Final Exam" && classType["label"] !== "Midterm";
            });

            return Object.assign({}, state, {
                types: types
            });
        case SET_COURSE_NUM:
            let courseNum;

            if (typeof action.courseNum === "string") {
                courseNum = action.courseNum.trim();
            } else {
                courseNum = null;
            }
            return Object.assign({}, state, {
                courseNum: courseNum
            });
        case SET_DEPARTMENT:
            let department;
            if (typeof action.department === "string") {
                department = action.department.trim().toUpperCase();
            } else {
                department = null;
            }

            return Object.assign({}, state, {
                department: department
            });
        case SET_INSTRUCTOR:
            return Object.assign({}, state, {
                instructor: action.instructor
            });
        case SET_PRIORITY:
            return Object.assign({}, state, {
                priority: action.priority
            });
        case SET_CONFLICTS:
            // set it back to an empty list if given null
            let conflicts = action.conflicts;
            if(!conflicts)
                conflicts = [];

            return Object.assign({}, state, {
                conflicts: conflicts,
            });
        case SET_EDIT_MODE:
            return Object.assign({}, state, {
                editMode: action.editMode
            });
        case SET_EDIT_OCCURRED:
            return Object.assign({}, state, {
                editOccurred: action.editOccurred,
            });
        case SET_MESSAGE_HANDLER:
            return Object.assign({}, state, {
                messageHandler: action.messageHandler,
            });
        case SET_ID:
            return Object.assign({}, state, {
                id: action.id,
            });
        default:
            return state;
    }
}


