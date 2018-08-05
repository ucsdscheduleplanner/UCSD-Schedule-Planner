import {setCalendarMode, setProgress} from "./ScheduleGenerationActions";
import {DataFetcher} from "../utils/DataFetcher";

export const SET_CURRENT_INSTRUCTOR = "SET_CURRENT_INSTRUCTOR";

export function setCurrentInstructor(instructor) {
    return {
        type: SET_CURRENT_INSTRUCTOR,
        currentInstructor: instructor
    }
}

export const SET_CURRENT_DEPARTMENT = "SET_CURRENT_DEPARTMENT";

export function setCurrentDepartment(department) {
    return {
        type: SET_CURRENT_DEPARTMENT,
        currentDepartment: department
    }
}

export function setClassSummaryFromDepartment(department) {
    return async function (dispatch) {
        let {courseNums, instructorsPerClass, classTypesPerClass} = await DataFetcher.fetchClassSummaryFor(department);

        dispatch(setCourseNums(courseNums));
        dispatch(setInstructorsPerClass(instructorsPerClass));
        dispatch(setClassTypesPerClass(classTypesPerClass));
    }
}

export const SET_COURSE_NUMS = "SET_COURSE_NUMS";
export function setCourseNums(courseNums) {
    return {
        type: SET_COURSE_NUMS,
        courseNums: courseNums
    }
}

export const SET_INSTRUCTORS_PER_CLASS = "SET_INSTRUCTORS_PER_CLASS ";
export function setInstructorsPerClass(instructorsPerClass) {
    return {
        type: SET_INSTRUCTORS_PER_CLASS,
        instructorsPerClass: instructorsPerClass
    }
}

export const SET_CLASS_TYPES_PER_CLASS = "SET_CLASS_TYPES_PER_CLASS";
export function setClassTypesPerClass(classTypesPerClass) {
    return {
        type: SET_CLASS_TYPES_PER_CLASS,
        classTypesPerClass: classTypesPerClass
    }
}

export const SET_CURRENT_COURSE_NUM = "SET_CURRENT_COURSE_NUM";

export function setCurrentCourseNum(courseNum) {
    return {
        type: SET_CURRENT_COURSE_NUM,
        currentCourseNum: courseNum
    }
}

export const SET_PRIORITY = "SET_PRIORITY";

export function setPriority(priority) {
    return {
        type: SET_PRIORITY,
        priority: priority
    }
}

export const SET_CONFLICTS = "SET_CONFLICTS";

export function setConflicts(conflicts) {
    return {
        type: SET_CONFLICTS,
        conflicts: conflicts
    }
}

export const REQUEST_CLASS_PER_DEPARTMENT = "REQUEST_CLASS_PER_DEPARTMENT";

export function requestClassesPerDepartment() {
    return {
        type: REQUEST_CLASS_PER_DEPARTMENT,
        requesting: true
    }
}

export const ADD_CLASS = "ADD_CLASS";

export function addClass(uuid, newClass) {
    return {
        type: ADD_CLASS,
        payload: {
            uuid: uuid,
            add: newClass
        }
    }
}

export const REMOVE_CLASS = "REMOVE_CLASS";

export function removeClass(uid) {
    return {
        type: REMOVE_CLASS,
        uid: uid
    }
}

export const SET_EDIT_MODE = "SET_EDIT_MODE";

export function setEditMode(uid, mode) {
    return {
        type: SET_EDIT_MODE,
        editMode: mode,
        editUID: uid
    }
}

export const EDIT_CLASS = "EDIT_CLASS";

export function editClass(uid, editClass) {
    return {
        type: EDIT_CLASS,
        editClass: editClass,
        editUID: uid
    }
}

export const INIT_MESSAGE_HANDLER = "INIT_MESSAGE_HANDLER";

export function initMessageHandler(messageHandler) {
    return {
        type: INIT_MESSAGE_HANDLER,
        messageHandler: messageHandler
    }
}

export function enterEditMode(uid) {
    return function (dispatch, getState) {
        const otherClass = getState().ClassSelection[uid];

        dispatch(setCalendarMode(false));
        dispatch(setProgress(0));

        dispatch(setPriority(otherClass.priority));
        dispatch(setConflicts(otherClass.conflicts));

        dispatch(setClassSummaryFromDepartment(otherClass.department));
        dispatch(setCurrentDepartment(otherClass.department));
        dispatch(setCurrentInstructor(otherClass.instructor));
        dispatch(setCurrentCourseNum(otherClass.courseNum));
        dispatch(setEditMode(uid, true));
    }
}

export function enterInputMode() {
    return function (dispatch) {
        dispatch(setCalendarMode(false));
        dispatch(setProgress(0));

        dispatch(setPriority(null));
        dispatch(setConflicts(null));
        dispatch(setCurrentInstructor(''));
        dispatch(setCurrentCourseNum(null));
        dispatch(setCurrentDepartment(null));
        dispatch(setEditMode(null, false));
    }
}
