export const ADD_TIME_PREFERENCE = "ADD_TIME_PREFERENCE";
export const REMOVE_TIME_PREFERENCE = "REMOVE_TIME_PREFERENCE";


export function addTimePreference(time) {
    return {
        type: ADD_TIME_PREFERENCE,
        time: time
    }
}

export function removeTimePreference(time) {
    return {
        type: REMOVE_TIME_PREFERENCE,
        time: time
    }
}
