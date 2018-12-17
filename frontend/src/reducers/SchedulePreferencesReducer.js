import {
    SET_DISPLAYED,
    ADD_DAY, ADD_END_TIME,
    ADD_START_TIME
} from "../actions/SchedulePreferencesActions";
import moment from "moment";

export default function SchedulePreferences(state = {
    sideBarActivated: false,
    startTimePreference: moment("1970-01-01 17:00Z"),
    endTimePreference: moment("1970-01-01 01:00Z"),
    dayPreference: null,
    // is a map from class title to preference object, e.g {"CSE 11": InstructorPreference}
    classPreferences: {},
    displayed: false,
}, action) {
    switch (action.type) {
        case ADD_START_TIME:
            return Object.assign({}, state, {
                startTimePreference: action.startTimePreference,
            });
        case ADD_END_TIME:
            return Object.assign({}, state, {
                endTimePreference: action.endTimePreference,
            });
        case ADD_DAY:
            return Object.assign({}, state, {
                dayPreference: action.dayPreference,
            });
        case SET_DISPLAYED:
            return Object.assign({}, state, {
                sideBarActivated: action.displayed
            });
        default:
            return state;
    }
}