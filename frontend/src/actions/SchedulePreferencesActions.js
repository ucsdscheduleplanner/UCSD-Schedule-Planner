
export const ADD_DAY = "ADD_DAY";
export function addDayPreference(dayPreference) {
    return {
        type: ADD_DAY,
        dayPreference: dayPreference
    }
}

export const ADD_START_TIME = "ADD_START_TIME";

export function addStartPreference(timePreference) {
    return {
        type: ADD_START_TIME,
        startTimePreference: timePreference
    }
}

export const ADD_END_TIME = "ADD_END_TIME";

export function addEndPreference(timePreference) {
    return {
        type: ADD_END_TIME,
        endTimePreference: timePreference
    }
}

export const SET_DISPLAYED = "SET_DISPLAYED";
export function setDisplayed(displayed) {
    return {
        type: SET_DISPLAYED,
        displayed: displayed
    }
}
