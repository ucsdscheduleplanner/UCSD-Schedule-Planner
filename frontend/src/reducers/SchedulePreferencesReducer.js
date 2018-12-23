import moment from "moment";
import {
    SET_CLASS_SPECIFIC_PREF,
    SET_CONFLICTS_PREF,
    SET_DAY_PREF,
    SET_END_PREF,
    SET_GLOBAL_PREF,
    SET_START_PREF
} from "../actions/SchedulePreference/SchedulePreferenceMutator";
import {SET_DISPLAYED} from "../actions/SchedulePreference/SchedulePreferenceUIHandler";
import {TimeBuilder} from "../utils/time/TimeUtils";

const momentDefaultStart = moment("1970-01-01 09:00Z").utcOffset(0);
const momentDefaultEnd = moment("1970-01-01 17:00Z").utcOffset(0);

// todo make a time builder
let defaultStart = new TimeBuilder().withHour(9).build();
let defaultEnd = new TimeBuilder().withHour(17).build();

const defaultGlobalPref = {
    startPref: defaultStart,
    endPref: defaultEnd,
    dayPref: null
};
export default function SchedulePreferences(state = {
    startPref: momentDefaultStart,
    endPref: momentDefaultEnd,
    globalPref: defaultGlobalPref,
    dayPref: null,
    classSpecificPref: null,
    displayed: false,
}, action) {
    switch (action.type) {
        case SET_START_PREF:
            return Object.assign({}, state, {
                startPref: action.startPref,
            });
        case SET_END_PREF:
            return Object.assign({}, state, {
                endPref: action.endPref,
            });
        case SET_DAY_PREF:
            if (!action.dayPref)
                action.dayPref = null;
            if (action.dayPref && action.dayPref.length === 0)
                action.dayPref = null;

            return Object.assign({}, state, {
                dayPref: action.dayPref,
            });
        case SET_CONFLICTS_PREF:
            break;
        case SET_GLOBAL_PREF:
            return Object.assign({}, state, {
                globalPref: action.globalPref,
            });
        case SET_CLASS_SPECIFIC_PREF:
            let copy = Object.assign({}, state.classSpecificPref);
            copy[action.classTitle] = action.classSpecificPref;

            return Object.assign({}, state, {
                classSpecificPref: copy,
            });
        case SET_DISPLAYED:
            return Object.assign({}, state, {
                displayed: action.displayed
            });
        default:
            return state;
    }
}