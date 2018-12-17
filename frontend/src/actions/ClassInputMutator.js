export const SET_INSTRUCTORS = "SET_INSTRUCTORS";
export const SET_DEPARTMENTS = "SET_DEPARTMENTS";
export const SET_COURSE_NUMS = "SET_COURSE_NUMS";
export const SET_TYPES = "SET_TYPES";

export const SET_DEPARTMENT = "SET_DEPARTMENT";
export const SET_COURSE_NUM = "SET_COURSE_NUM";
export const SET_INSTRUCTOR = "SET_INSTRUCTOR";
export const SET_EDIT_OCCURRED = "SET_EDIT_OCCURRED";
export const SET_CONFLICTS = "SET_CONFLICTS";
export const SET_PRIORITY = "SET_PRIORITY";
export const SET_EDIT_MODE = "SET_EDIT_MODE";
export const SET_MESSAGE_HANDLER = "SET_MESSAGE_HANDLER";


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

export function setConflicts(conflicts) {
    return {
        type: SET_CONFLICTS,
        conflicts: conflicts
    }
}

export function setEditMode(uid, mode) {
    return {
        type: SET_EDIT_MODE,
        editMode: mode,
        editUID: uid
    }
}

export function setMessageHandler(messageHandler) {
    return {
        type: SET_MESSAGE_HANDLER,
        messageHandler: messageHandler
    }
}

export function setEditOccurred(occurred) {
    return {
        type: SET_EDIT_OCCURRED,
        occurred: occurred
    }
}




