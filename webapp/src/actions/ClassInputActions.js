import {BACKEND_URL} from "../settings";
import {setCalendarMode, setProgress} from "./ScheduleGenerationActions";


const codeToClassType = {
    "AC": "Activity",
    "CL": "Clinical Clerkship",
    "CO": "Conference",
    "DI": "Discussion",
    "FI": "Final Exam",
    "FM": "Film",
    "FW": "Fieldwork",
    "IN": "Independent Study",
    "IT": "Internship",
    "LA": "Lab",
    "LE": "Lecture",
    "MI": "Midterm",
    "MU": "Make-up Session",
    "OT": "Other Additional Meeting",
    "PB": "Problem Session",
    "PR": "Practicum",
    "RE": "Review Session",
    "SE": "Seminar",
    "ST": "Studio",
    "TU": "Tutorial",
};

export const classTypeToCode = {
    "Activity": "AC",
    "Clinical Clerkship": "CL",
    "Conference": "CO",
    "Discussion": "DI",
    "Final Exam": "DI",
    "Film": "FM",
    "Fieldwork": "FW",
    "Independent Study": "IN",
    "Internship": "IT",
    "Lab": "LA",
    "Lecture": "LE",
    "Midterm": "MI",
    "Make-up Session": "MU",
    "Other Additional Meeting": "OT",
    "Problem Session": "PB",
    "Practicum": "PR",
    "Review Session": "RE",
    "Seminar": "SE",
    "Studio": "ST",
    "Tutorial": "TU"
};

const codeKeyToVal = {
    "AC_KEY": 6,
    "CL_KEY": 6,
    "CO_KEY": 6,
    "DI_KEY": 7,
    "FI_KEY": 10,
    "FM_KEY": 6,
    "FW_KEY": 6,
    "IN_KEY": 6,
    "IT_KEY": 6,
    "LA_KEY": 8,
    "LE_KEY": 1,
    "MI_KEY": 9,
    "MU_KEY": 9,
    "OT_KEY": 6,
    "PB_KEY": 6,
    "PR_KEY": 6,
    "RE_KEY": 6,
    "SE_KEY": 6,
    "ST_KEY": 6,
    "TU_KEY": 6,
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

export const REQUEST_CLASS_PER_DEPARTMENT = "REQUEST_CLASS_PER_DEPARTMENT";

export function requestClassesPerDepartment() {
    return {
        type: REQUEST_CLASS_PER_DEPARTMENT,
        requesting: true
    }
}

export const RECEIVE_CLASS_PER_DEPARTMENT = "RECEIVE_CLASS_PER_DEPARTMENT";

export function receiveClassesPerDepartment(department, courseNums, instructors, types) {
    return {
        type: RECEIVE_CLASS_PER_DEPARTMENT,
        requesting: false,
        department: department,
        courseNums: courseNums,
        instructorsPerClass: instructors,
        classTypesPerClass: types,
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

export function enterEditMode(uid) {
    return function (dispatch, getState) {
        const otherClass = getState().ClassSelection[uid];

        dispatch(setCalendarMode(false));
        dispatch(setProgress(0));

        dispatch(setPriority(otherClass.priority));
        dispatch(setConflicts(otherClass.conflicts));
        dispatch(setCurrentInstructor(otherClass.instructor));
        dispatch(setCurrentCourseNum(otherClass.courseNum));
        dispatch(setCurrentDepartment(otherClass.department));
        dispatch(setEditMode(uid, true));
    }
}

export function enterInputMode() {
    return function (dispatch) {
        dispatch(setCalendarMode(false));
        dispatch(setProgress(0));

        dispatch(setPriority(null));
        dispatch(setConflicts(null));
        dispatch(setCurrentInstructor(null));
        dispatch(setCurrentCourseNum(null));
        dispatch(setCurrentDepartment(null));
        dispatch(setEditMode(null, false));
    }
}

/**
 * Returns the courseNums in a specific department
 * @param department - the department we are looking at
 * @returns {Function} - a closure that will be used by redux thunk
 */
export function getClasses(department) {
    return function (dispatch) {
        // tell the store that we are requesting
        dispatch(requestClassesPerDepartment);

        fetchClasses(department).then(classData => {
            let {courseNums, instructorsPerClass, classTypesPerClass} = classData;
            dispatch(receiveClassesPerDepartment(department, courseNums, instructorsPerClass, classTypesPerClass));
        });
    }
}

/**
 * Update the class list with courseNums from the given department.
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
                    res = res["COURSE_NUMS"];
                    // putting the response inside unsorted list
                    let unsorted = new Set();
                    let classTypesPerClass = {};
                    let instructorsPerClass = {};

                    // classArrKey is the course num
                    for(let classArrKey of Object.keys(res)) {
                        // classArr holds an array of all the subsections of each class
                        // for each class subsection, meaning for cse 11 lecture then lab...
                        let classArr = res[classArrKey];
                        instructorsPerClass[classArrKey] = new Set();
                        classTypesPerClass[classArrKey] = new Set();
                        unsorted.add(classArrKey);

                        for(let Class of classArr) {
                            let instructors = [...Class["INSTRUCTOR"].split("\n")];
                            // filter them first before adding
                            // just in case we have multiple instructors on one line
                            instructors = instructors
                                .filter((instructor) => instructor.length > 0)
                                .map((instructor) => instructor.trim());
                            // adding to set
                            instructorsPerClass[classArrKey].add(...instructors);

                            let classType = Class["TYPE"];
                            // adding to set
                            classTypesPerClass[classArrKey].add(classType);
                        }

                        // converting back into set
                        instructorsPerClass[classArrKey] = [...instructorsPerClass[classArrKey]];
                        classTypesPerClass[classArrKey] = [...classTypesPerClass[classArrKey]]
                            .sort((a, b) => codeKeyToVal[a] - codeKeyToVal[b])
                                .map((classTypeStr) => {
                                    return {label: codeToClassType[classTypeStr], value: codeToClassType[classTypeStr]};
                                });
                    }

                    // sorting based on comparator for the course nums
                    let sortedCourseNums = [...unsorted].sort((element1, element2) => {
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

                    for(let key of Object.keys(instructorsPerClass)) {
                        instructorsPerClass[key] = [...instructorsPerClass[key]];
                    }

                    resolve({
                        courseNums: sortedCourseNums,
                        classTypesPerClass: classTypesPerClass,
                        instructorsPerClass: instructorsPerClass
                    });
                }).catch(error => reject(error).catch(error => reject(error)));
        }
    )
}
