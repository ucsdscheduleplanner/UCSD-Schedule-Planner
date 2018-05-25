import {generateSchedule} from "../schedulegeneration/ScheduleGeneratorBruteForce";
import {InstructorPreference, PriorityPreference} from "../utils/Preferences";
import {classTypeToCode} from "./ClassInputActions";

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


export function getSchedule(selectedClasses) {
    return function (dispatch) {
        dispatch(requestSchedule);

        let preferences = [];
        let conflicts = {};
        Object.values(selectedClasses).forEach((Class) => {
            if (Class.priority !== null) preferences.push(new PriorityPreference(Class, Class.priority));
            if (Class.instructor !== null) preferences.push(new InstructorPreference(Class, Class.instructor));

            conflicts[Class.class_title] = [];
            if(Class.conflicts) {
                conflicts[Class.class_title] = Class.conflicts.map((conflict) => classTypeToCode[conflict])
            }
        });

        return generateSchedule(selectedClasses, conflicts, preferences)
            .then((schedule) => {
                dispatch(receiveSchedule(schedule));
                dispatch(enterCalendarMode())
            });
    }
}

