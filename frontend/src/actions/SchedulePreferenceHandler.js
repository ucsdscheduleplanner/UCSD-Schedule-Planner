export const SET_START_PREF = "SET_START_PREF";
export const SET_DAY_PREF = "ADD_DAY_PREF";
export const SET_END_PREF = "ADD_END_PREF";
export const SET_INSTRUCTOR_PREF = "ADD_INSTRUCTOR_PREF";
export const SET_PRIORITY_PREF = "SET_PRIORITY_PREF";
export const SET_CONFLICTS_PREF = "SET_CONFLICTS_PREF";

export function setDayPref(dayPref) {
    return {
        type: SET_DAY_PREF,
        dayPreference: dayPref
    }
}

export function setStartPref(timePref) {
    return {
        type: SET_START_PREF,
        startTimePreference: timePref
    }
}

export function setEndPref(timePref) {
    return {
        type: SET_END_PREF,
        endTimePreference: timePref
    }
}

export function setInstructorPref(classTitle, instructorPref) {
    return {
        type: SET_INSTRUCTOR_PREF,
        classTitle: classTitle,
        instructorPref: instructorPref
    }
}

export function setPriorityPref(classTitle, priorityPref) {
    return {
        type: SET_PRIORITY_PREF,
        classTitle: classTitle,
        priorityPref: priorityPref
    }
}
