export const SET_START_PREF = "SET_START_PREF";
export const SET_DAY_PREF = "ADD_DAY_PREF";
export const SET_END_PREF = "ADD_END_PREF";
export const SET_CONFLICTS_PREF = "SET_CONFLICTS_PREF";
export const SET_GLOBAL_PREF = "SET_GLOBAL_PREF";
export const SET_CLASS_SPECIFIC_PREF = "SET_CLASS_SPECIFIC_PREF";

export function setDayPref(dayPref) {
    return {
        type: SET_DAY_PREF,
        dayPref: dayPref
    }
}

export function setStartPref(timePref) {
    return {
        type: SET_START_PREF,
        startPref: timePref
    }
}

export function setEndPref(timePref) {
    return {
        type: SET_END_PREF,
        endPref: timePref
    }
}

export function setGlobalPref(globalPref) {
    return {
        type: SET_GLOBAL_PREF,
        globalPref: globalPref
    }
}

export function setClassSpecificPref(classTitle, classSpecificPref) {
    return {
        type: SET_CLASS_SPECIFIC_PREF,
        classTitle: classTitle,
        classSpecificPref: classSpecificPref
    }
}
