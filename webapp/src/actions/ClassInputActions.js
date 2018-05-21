import {BACKEND_URL} from "../settings";


const codeToClassType = {
    "AC_KEY": "Activity",
    "CL_KEY": "Clinical Clerkship",
    "CO_KEY": "Conference",
    "DI_KEY": "Discussion",
    "FI_KEY": "Final Exam",
    "FM_KEY": "Film",
    "FW_KEY": "Fieldwork",
    "IN_KEY": "Independent Study",
    "IT_KEY": "Internship",
    "LA_KEY": "Lab",
    "LE_KEY": "Lecture",
    "MI_KEY": "Midterm",
    "MU_KEY": "Make-up Session",
    "OT_KEY": "Other Additional Meeting",
    "PB_KEY": "Problem Session",
    "PR_KEY": "Practicum",
    "RE_KEY": "Review Session",
    "SE_KEY": "Seminar",
    "ST_KEY": "Studio",
    "TU_KEY": "Tutorial",
};

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

export const REQUEST_DEPARTMENTS = "REQUEST_DEPARTMENTS";

export function requestDepartments() {
    return {
        type: REQUEST_DEPARTMENTS,
        requesting: true
    }
}

export const RECEIVE_DEPARTMENTS = "RECEIVE_DEPARTMENTS";

export function receiveDepartments(departments) {
    return {
        type: RECEIVE_DEPARTMENTS,
        departments: departments,
        requesting: false
    }
}

export const REQUEST_CLASS_PER_DEPARTMENT = "REQUEST_CLASS_PER_DEPARTMENT";

export function requestClassesPerDepartment() {
    return {
        type: REQUEST_CLASS_PER_DEPARTMENT,
        requesting: true
    }
}

export const RECEIVE_CLASS_PER_DEPARTMENT = "RECEIVE_CLASS_PER_DEPARTMENT";

export function receiveClassesPerDepartment(classes, instructors, types) {
    return {
        type: RECEIVE_CLASS_PER_DEPARTMENT,
        requesting: false,
        classes: classes,
        instructorsPerClass: instructors,
        classTypesPerClass: types,
    }
}

export function getDepartments() {
    return function (dispatch) {
        dispatch(requestDepartments);

        fetchDepartments().then(departments => dispatch(receiveDepartments(departments)));
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

export function removeClass(uuid) {
    return {
        type: REMOVE_CLASS,
        uuid: uuid
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

export function enterEditMode(uid) {
    return function (dispatch, getState) {
        const otherClass = getState().ClassSelection[uid];

        dispatch(setPriority(otherClass.priority));
        dispatch(setConflicts(otherClass.conflicts));
        dispatch(setCurrentInstructor(otherClass.instructor));
        dispatch(setCurrentCourseNum(otherClass.course_num));
        dispatch(setCurrentDepartment(otherClass.department));
        dispatch(setEditMode(uid, true));
    }
}

export function exitEditMode() {
    return function (dispatch) {
        dispatch(setPriority(null));
        dispatch(setConflicts(null));
        dispatch(setCurrentInstructor(null));
        dispatch(setCurrentCourseNum(null));
        dispatch(setCurrentDepartment(null));
        dispatch(setEditMode(null, false));
    }
}

/**
 * Returns the classes in a specific department
 * @param department - the department we are looking at
 * @returns {Function} - a closure that will be used by redux thunk
 */
export function getClasses(department) {
    return function (dispatch) {
        dispatch(requestClassesPerDepartment);

        fetchClasses(department).then(classData => {
            let {classes, instructorsPerClass, classTypesPerClass} = classData;
            dispatch(receiveClassesPerDepartment(classes, instructorsPerClass, classTypesPerClass));
        });
    }
}

/**
 * Fetch all the departments in the course catalog
 * @returns {Promise} a promise of a list of the departments
 */
function fetchDepartments() {
    return new Promise((resolve, reject) => {
        fetch(`${BACKEND_URL}/api_department`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'get'
        })
            .then(res => res.json())
            .then(res => {
                resolve(res.map((resObj) => resObj["DEPT_CODE"]));
            }).catch(error => reject(error)).catch(error => reject(error));
    });
}

/**
 * Update the class list with classes from the given department.
 */
function fetchClasses(department) {
    return new Promise((resolve, reject) => {
        fetch(`${BACKEND_URL}/api_classes?department=${department}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'get'
        })
            .then(res => res.json())
            .then(res => {
                // putting the response inside unsorted list
                let unsorted = res.map((dict) => dict["COURSE_NUM"]);

                // sorting based on comparator for the course nums
                let sortedClasses = unsorted.sort((element1, element2) => {
                    // match numerically
                    let num1 = parseInt(element1.match(/\d+/)[0], 10);
                    let num2 = parseInt(element2.match(/\d+/)[0], 10);

                    if (num1 < num2) return -1;
                    if (num2 < num1) return 1;
                    // checking lexicographically if they are the same number
                    if (element1 < element2) return -1;
                    if (element2 < element1) return 1;
                    return 0;
                });

                let classTypesPerClass = {};
                let instructorsPerClass = {};
                for (let dict of res) {
                    classTypesPerClass[dict["COURSE_NUM"]] = Object.keys(dict).filter((property) => {
                        return property.endsWith("KEY") && dict[property] !== null;
                    }).map((classTypeStr) => {
                        return {label: codeToClassType[classTypeStr], value: codeToClassType[classTypeStr]};
                    });

                    instructorsPerClass[dict["COURSE_NUM"]] = dict["INSTRUCTOR"].split("\n");
                    instructorsPerClass[dict["COURSE_NUM"]] = instructorsPerClass[dict["COURSE_NUM"]]
                        .filter((instructor) => instructor.length > 0)
                        .map((instructor) => instructor.trim());
                }

                resolve({
                    classes: sortedClasses,
                    classTypesPerClass: classTypesPerClass,
                    instructorsPerClass: instructorsPerClass
                });
            }).catch(error => reject(error).catch(error => reject(error)));
    });
}
