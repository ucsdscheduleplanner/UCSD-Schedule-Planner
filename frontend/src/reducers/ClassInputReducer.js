import {
    INIT_MESSAGE_HANDLER,
    REQUEST_CLASS_PER_DEPARTMENT,
    SET_CLASS_TYPES_PER_CLASS,
    SET_CONFLICTS,
    SET_COURSE_NUMS,
    SET_CURRENT_COURSE_NUM,
    SET_CURRENT_DEPARTMENT,
    SET_CURRENT_INSTRUCTOR, SET_DESCRIPTIONS_PER_CLASS,
    SET_EDIT_MODE,
    SET_INSTRUCTORS_PER_CLASS,
    SET_PRIORITY
} from "../actions/ClassInputActions";

export default function ClassInput(state = {
    requesting: false,
    // courseNums will be a dict where each value is an array of
    // courseNums and each key is a department
    courseNums: [],
    instructorsPerClass: {},
    classTypesPerClass: {},
    descriptionsPerClass: {},

    selectedConflicts: [],
    currentInstructor: null,
    currentDepartment: null,
    currentCourseNum: null,
    priority: null,
    editMode: false,
    editUID: null,
    messageHandler: null,
}, action) {
    switch (action.type) {
        case REQUEST_CLASS_PER_DEPARTMENT:
            return Object.assign({}, state, {
                requesting: action.requesting
            });
        case SET_INSTRUCTORS_PER_CLASS:
            return Object.assign({}, state, {
                instructorsPerClass: action.instructorsPerClass
            });
        case SET_DESCRIPTIONS_PER_CLASS:
            return Object.assign({}, state, {
                descriptionsPerClass: action.descriptionsPerClass
            });
        case SET_CLASS_TYPES_PER_CLASS:
            return Object.assign({}, state, {
                classTypesPerClass: action.classTypesPerClass
            });
        case SET_COURSE_NUMS:
            return Object.assign({}, state, {
                courseNums: action.courseNums
            });
        case SET_CURRENT_COURSE_NUM:
            let currentCourseNum;
            if(typeof action.currentCourseNum === "string") {
                currentCourseNum = action.currentCourseNum.trim();
            } else {
                currentCourseNum = null;
            }
            return Object.assign({}, state, {
                currentCourseNum: currentCourseNum
            });
        case SET_CURRENT_DEPARTMENT:
            let currentDepartment;
            if (typeof action.currentDepartment === "string") {
                currentDepartment = action.currentDepartment.trim().toUpperCase();
            } else {
                currentDepartment = null;
            }

            return Object.assign({}, state, {
                currentDepartment: currentDepartment
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
        case INIT_MESSAGE_HANDLER:
            return Object.assign({}, state, {
                messageHandler: action.messageHandler,
            });
        default:
            return state;
    }
}


