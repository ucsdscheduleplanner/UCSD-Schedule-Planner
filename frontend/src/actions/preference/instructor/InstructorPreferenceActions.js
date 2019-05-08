export const SET_INSTRUCTOR_PREF = "SET_INSTRUCTOR_PREF";


export function setInstructorPref(classTitle, instructor) {
    return {
        type: SET_INSTRUCTOR_PREF,
        classTitle: classTitle,
        instructor: instructor,
    }
}
