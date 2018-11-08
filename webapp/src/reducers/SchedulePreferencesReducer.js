import {
    ACTIVATE_SCHEDULE_PREFERENCES, DEACTIVATE_SCHEDULE_PREFERENCES,
    SET_DAY_PREFERENCE, SET_END_TIME_PREFERENCE,
    SET_START_TIME_PREFERENCE
} from "../actions/SchedulePreferencesActions";
import moment from "moment";

export default function SchedulePreferences(state = {
    startTimePreference: moment("1970-01-01 17:00Z"),
    endTimePreference: moment("1970-01-01 01:00Z"),
    dayPreference: null,
    activated: false,
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
        case ACTIVATE_SCHEDULE_PREFERENCES:
            return Object.assign({}, state, {
                activated: true
            });
        case DEACTIVATE_SCHEDULE_PREFERENCES:
            return Object.assign({}, state, {
                activated: false
            });
        default:
            return state;
    }
}