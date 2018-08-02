import {ScheduleGenerationBruteForce} from "../schedulegeneration/ScheduleGeneratorBruteForce";
import {DayPreference, InstructorPreference, PriorityModifier, TimePreference} from "../utils/Preferences";
import {classTypeToCode, DataFetcher} from "../utils/DataFetcher";


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
    return function (progress) {
        dispatch(setProgress(progress));
    }
}

/**
 * Populates the preference array with the correct Preference objects.
 *
 * @param Class the class with the preferences
 * @param preferences the array to populate
 */
function handlePriority(Class, preferences) {
    let priority = 1;
    let preferencesToBeModified = [];
    if (Class.priority !== null) {
        priority = Class.priority;
    }

    if (Class.instructor !== null) {
        preferencesToBeModified.push(new InstructorPreference(Class, Class.instructor));
    }

    let priorityModifier = new PriorityModifier(Class, preferencesToBeModified, priority);
    // add preferences to the priority modifier
    preferences.push(priorityModifier);
}

/**
 * Will populate the conflicts object with the correct info about Class -> type conflicts
 *
 * Creates a mapping like so:
 * e.g Class1 -> [LE, DI]
 *     Class2 -> [LA]
 * @param Class the class to consider - has a list of type conflicts
 * @param conflicts the conflicts array to populate
 */
function handleConflicts(Class, conflicts) {
    // class not guaranteed to have conflicts array populated
    if (Class.conflicts) {
        if (!(Class.classTitle in conflicts)) {
            conflicts[Class.classTitle] = [];
        }
        conflicts[Class.classTitle] = Class.conflicts.map((conflict) => classTypeToCode[conflict])
    }
}

function handleSchedulePreferences(scheduleOptions, preferences) {
    let startTime = scheduleOptions.startTimePreference;
    let endTime = scheduleOptions.endTimePreference;
    let days = scheduleOptions.dayPreference;

    if (startTime && endTime) {
        preferences.push(new TimePreference(startTime, endTime));
    }

    if (days) {
        preferences.push(new DayPreference(days));
    }
}

/**
 * This is in redux so we have hooks that determine the progress of generating the schedule
 *
 * @param selectedClasses comes in as a dictionary so must convert to a list
 * @returns {Function}
 */
export function getSchedule(selectedClasses) {
    return async function (dispatch, getState) {
        // let redux know that we are creating a schedule
        dispatch(requestSchedule());

        selectedClasses = Object.values(selectedClasses);


        let preferences = [];
        let conflicts = {};
        // setting progress to 0 initially
        dispatch(setProgress(0));
        let dispatchProgressFunction = dispatchProgress(dispatch);

        let scheduleOptions = getState().ScheduleOptions;
        handleSchedulePreferences(scheduleOptions, preferences);
        // Class has very little data but the names
        // passes in data from UI
        for (let Class of selectedClasses) {
            handlePriority(Class, preferences);
            handleConflicts(Class, conflicts);
        }

        let classData = await DataFetcher.fetchClassData(selectedClasses);
        // handles all schedule generation including the queries for data
        return new ScheduleGenerationBruteForce().generateSchedule(classData, conflicts, preferences, dispatchProgressFunction)
            .then((schedule) => {
                dispatch(receiveSchedule(schedule));
                dispatch(enterCalendarMode())
            });
    }
}

