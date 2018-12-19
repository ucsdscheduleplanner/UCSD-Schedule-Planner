export const SET_DISPLAYED = "SET_DISPLAYED";
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
