import moment from "moment";
import {
    SET_CONFLICTS_PREF,
    SET_DAY_PREF,
    SET_END_PREF,
    SET_INSTRUCTOR_PREF,
    SET_PRIORITY_PREF,
    SET_START_PREF
} from "../actions/SchedulePreferenceHandler";
import {SET_DISPLAYED} from "../actions/SchedulePreferenceUIHandler";

export default function SchedulePreferences(state = {
    startPref: moment("1970-01-01 17:00Z"),
    endPref: moment("1970-01-01 01:00Z"),
    dayPref: null,
    instructorPref: {},
    priorityPref: {},
    displayed: false,
}, action) {
    let classTitle;
    let copy;
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
            return Object.assign({}, state, {
                dayPref: action.dayPref,
            });
        case SET_INSTRUCTOR_PREF:
            classTitle = action.classTitle;
            let instructor = action.instructor;

            copy = Object.assign({}, state.priorityPref);
            copy[classTitle] = instructor;

            return Object.assign({}, state, {
                instructorPref: copy
            });
        case SET_PRIORITY_PREF:
            classTitle = action.classTitle;
            let priority = action.priority;

            copy = Object.assign({}, state.priorityPref);
            copy[classTitle] = priority;

            return Object.assign({}, state, {
                priorityPref: copy
            });
        case SET_CONFLICTS_PREF:
            break;
        case SET_DISPLAYED:
            return Object.assign({}, state, {
                displayed: action.displayed
            });
        default:
            return state;
    }
}