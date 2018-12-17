export const SET_DISPLAYED = "SET_DISPLAYED";
export const ADD_START_TIME = "ADD_START_TIME";
export const ADD_DAY = "ADD_DAY";
export const ADD_END_TIME = "ADD_END_TIME";

export function addDayPreference(dayPreference) {
    return {
        type: ADD_DAY,
        dayPreference: dayPreference
    }
}


export function addStartPreference(timePreference) {
    return {
        type: ADD_START_TIME,
        startTimePreference: timePreference
    }
}

export function addEndPreference(timePreference) {
    return {
        type: ADD_END_TIME,
        endTimePreference: timePreference
    }
}

export function toggleDisplayed() {
    return function (dispatch, getState) {
        const state = getState().SchedulePreferences;

        if (state.displayed)
            dispatch(setDisplayed(false));
        else dispatch(setDisplayed(true));
    }
}

export function setDisplayed(displayed) {
    return {
        type: SET_DISPLAYED,
        displayed: displayed
    }
}

