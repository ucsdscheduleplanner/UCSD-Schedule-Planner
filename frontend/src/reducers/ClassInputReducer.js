import {POPULATE_DATA_PER_CLASS} from "../actions/classinput/ClassInputActions";
import {SET_COURSE_NUMS} from "../actions/classinput/ClassInputMutator";
import {SET_COURSE_NUM} from "../actions/classinput/ClassInputMutator";
import {SET_DEPARTMENT} from "../actions/classinput/ClassInputMutator";
import {SET_DEPARTMENTS} from "../actions/classinput/ClassInputMutator";
import {SET_INSTRUCTOR} from "../actions/classinput/ClassInputMutator";
import {SET_PRIORITY} from "../actions/classinput/ClassInputMutator";
import {SET_CLASS_TYPES_TO_IGNORE} from "../actions/classinput/ClassInputMutator";
import {SET_EDIT_MODE} from "../actions/classinput/ClassInputMutator";
import {SET_MESSAGE_HANDLER} from "../actions/classinput/ClassInputMutator";
import {SET_INSTRUCTORS} from "../actions/classinput/ClassInputMutator";
import {SET_TYPES} from "../actions/classinput/ClassInputMutator";
import {SET_EDIT_OCCURRED} from "../actions/classinput/ClassInputMutator";
import {SET_TRANSACTION_ID} from "../actions/classinput/ClassInputMutator";
import {ConsoleMessageHandler} from "../utils/message/ConsoleMessageHandler";
import uuid from 'uuid';

export default function ClassInputReducer(state = {
    departments: [],
    courseNums: [],
    instructors: [],
    classTypesToIgnore: [],
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

    transactionID: uuid.v4()
}, action) {
    switch (action.type) {
        case POPULATE_DATA_PER_CLASS:
            return Object.assign({}, state, {
                instructorsPerClass: action.instructorsPerClass,
                descriptionsPerClass: action.descriptionsPerClass,
                classTypesPerClass: action.classTypesPerClass
            });
        case SET_COURSE_NUMS:
            if(!action.courseNums)
                action.courseNums = [];
            return Object.assign({}, state, {
                courseNums: action.courseNums
            });
        case SET_DEPARTMENTS:
            if(!action.departments)
                action.departments = [];
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
        case SET_CLASS_TYPES_TO_IGNORE:
            // set it back to an empty list if given null
            let classTypesToIgnore = action.classTypesToIgnore;
            if(!classTypesToIgnore)
                classTypesToIgnore = [];

            return Object.assign({}, state, {
                classTypesToIgnore: classTypesToIgnore,
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
        case SET_TRANSACTION_ID:
            if(!action.transactionID)
                action.transactionID = uuid.v4();
            return Object.assign({}, state, {
                transactionID: action.transactionID,
            });
        default:
            return state;
    }
}


