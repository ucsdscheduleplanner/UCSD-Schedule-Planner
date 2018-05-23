import {generateSchedule} from "../schedulegeneration/ScheduleGeneratorBruteForce";
import {InstructorPreference, PriorityPreference} from "../utils/Preferences";

export const REQUEST_SCHEDULE = 'REQUEST_SCHEDULE';

export function requestSchedule() {
    return {
        type: REQUEST_SCHEDULE,
        generating: true,
    }
}

export const RECEIVE_SCHEDULE = 'RECEIVE_SCHEDULE';

export function receiveSchedule(schedule) {
    return {
        type: RECEIVE_SCHEDULE,
        schedule: schedule,
        generating: false
    }
}

export const SET_UID = "SET_UID";

export function setUID(uid) {
    return {
        type: SET_UID,
        uid: uid,
    }
}

export const SET_CALENDAR_MODE = "SET_CALENDAR_MODE";

export function setCalendarMode(mode) {
    return {
        type: SET_CALENDAR_MODE,
        calendarMode: mode
    }
}

export function enterCalendarMode() {
    return function (dispatch) {
        dispatch(setCalendarMode(true));
    }
}

export function exitCalendarMode() {
    return function (dispatch) {
        dispatch(setCalendarMode(false));
    }
}


export function getSchedule(classList) {
    return function (dispatch) {
        dispatch(requestSchedule);

        let preferences = [];
        Object.values(classList).forEach((Class) => {
            if (Class.priority !== null) preferences.push(new PriorityPreference(Class, Class.priority));
            if (Class.instructor !== null) preferences.push(new InstructorPreference(Class, Class.instructor));
        });

        return generateSchedule(classList, preferences)
            .then((schedule) => {
                dispatch(receiveSchedule(schedule));
                dispatch(enterCalendarMode())
            });
    }
}

