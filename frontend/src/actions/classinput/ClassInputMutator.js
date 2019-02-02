export const SET_INSTRUCTORS = "SET_INSTRUCTORS";
export const SET_DEPARTMENTS = "SET_DEPARTMENTS";
export const SET_COURSE_NUMS = "SET_COURSE_NUMS";
export const SET_TYPES = "SET_TYPES";

export const SET_DEPARTMENT = "SET_DEPARTMENT";
export const SET_COURSE_NUM = "SET_COURSE_NUM";
export const SET_INSTRUCTOR = "SET_INSTRUCTOR";
export const SET_EDIT_OCCURRED = "SET_EDIT_OCCURRED";
export const SET_CLASS_TYPES_TO_IGNORE = "SET_CLASS_TYPES_TO_IGNORE";
export const SET_PRIORITY = "SET_PRIORITY";
export const SET_EDIT_MODE = "SET_EDIT_MODE";
export const SET_MESSAGE_HANDLER = "SET_MESSAGE_HANDLER";
export const SET_TRANSACTION_ID = "SET_TRANSACTION_ID";

export function setCourseNums(courseNums) {
    return {
        type: SET_COURSE_NUMS,
        courseNums: courseNums
    }
}

export function setDepartments(departments) {
    return {
        type: SET_DEPARTMENTS,
        departments: departments
    }
}

export function setTypes(types) {
    return {
        type: SET_TYPES,
        types: types
    }
}

export function setInstructors(instructors) {
    return {
        type: SET_INSTRUCTORS,
        instructors: instructors,
    }
}

export function setDepartment(department) {
    return {
        type: SET_DEPARTMENT,
        department: department
    }
}

export function setCourseNum(courseNum) {
    return {
        type: SET_COURSE_NUM,
        courseNum: courseNum
    }
}

export function setInstructor(instructor) {
    return {
        type: SET_INSTRUCTOR,
        instructor: instructor
    }
}

export function setPriority(priority) {
    return {
        type: SET_PRIORITY,
        priority: priority
    }
}

/**
 * This function updates the ClassInput UI with the class types to ignore for
 * the specific class given, not globally, that responsibility is delegated to the reducer
 * @param classTypesToIgnore
 * @returns {{type: string, conflicts: *}}
 */
export function setClassTypesToIgnore(classTypesToIgnore) {
    return {
        type: SET_CLASS_TYPES_TO_IGNORE,
        classTypesToIgnore: classTypesToIgnore
    }
}

export function setEditMode(mode) {
    return {
        type: SET_EDIT_MODE,
        editMode: mode,
    }
}

/**
 * Sets the id for the current Class Input
 * @param transactionID should be a string
 * @returns {{type: string, id: *}}
 */
export function setTransactionID(transactionID) {
    return {
        type: SET_TRANSACTION_ID,
        transactionID: transactionID
    }
}

export function setMessageHandler(messageHandler) {
    return {
        type: SET_MESSAGE_HANDLER,
        messageHandler: messageHandler
    }
}

export function setEditOccurred(editOccurred) {
    return {
        type: SET_EDIT_OCCURRED,
        editOccurred: editOccurred
    }
}




