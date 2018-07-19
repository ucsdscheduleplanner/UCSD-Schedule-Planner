import {
    SET_DAY_PREFERENCE, SET_END_TIME_PREFERENCE,
    SET_START_TIME_PREFERENCE
} from "../actions/ScheduleOptionsActions";

export default function ScheduleOptions(state = {
    startTimePreference: null,
    endTimePreference: null,
    dayPreference: null
}, action) {
    switch (action.type) {
        case SET_START_TIME_PREFERENCE:
            return Object.assign({}, state, {
                startTimePreference: action.startTimePreference,
            });
        case SET_END_TIME_PREFERENCE:
            return Object.assign({}, state, {
                endTimePreference: action.endTimePreference,
            });
        case SET_DAY_PREFERENCE:
            return Object.assign({}, state, {
                dayPreference: action.dayPreference,
            });
        default:
            return state;
    }
}