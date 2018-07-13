import {
    ScheduleGenerationBruteForce
} from "../schedulegeneration/ScheduleGeneratorBruteForce";
import {InstructorPreference, PriorityModifier} from "../utils/Preferences";
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

export const SET_PROGRESS = "SET_PROGRESS";
export function setProgress(generatingProgress) {
    return {
        type: SET_PROGRESS,
        generatingProgress: generatingProgress
    }
}

function dispatchProgress(dispatch) {
    return function(progress) {
        dispatch(setProgress(progress));
    }
}

export function getSchedule(selectedClasses) {
    return async function (dispatch) {
        // let redux know that we are creating a scheedule
        dispatch(requestSchedule());

        let preferences = [];
        let conflicts = {};
        // setting progress to 0 initially
        dispatch(setProgress(0));
        let dispatchProgressFunction = dispatchProgress(dispatch);

        // this class has no data but the names
        // passes in data from UI
        Object.values(selectedClasses).forEach((Class) => {
            let priorityModifier = new PriorityModifier(Class);
            if (Class.priority !== null) {
                priorityModifier.priority = Class.priority;
            }

            // add preferences to the priority modifier
            if (Class.instructor !== null) {
                priorityModifier.preferences.push(new InstructorPreference(Class, Class.instructor));
            }
            preferences.push(priorityModifier);

            // passing conflicts
            if (Class.conflicts) {
                if (!(Class.classTitle in conflicts)) {
                    conflicts[Class.classTitle] = [];
                }
                conflicts[Class.classTitle] = Class.conflicts.map((conflict) => classTypeToCode[conflict])
            }
        });

        // handles all scchedule generation including the queries for data
        return new ScheduleGenerationBruteForce().generateSchedule(selectedClasses, conflicts, preferences, dispatchProgressFunction)
            .then((schedule) => {
                dispatch(receiveSchedule(schedule));
                dispatch(enterCalendarMode())
            });
    }
}

