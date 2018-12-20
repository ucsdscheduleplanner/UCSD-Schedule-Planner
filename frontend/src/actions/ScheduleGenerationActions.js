import {DayPreference, InstructorPreference, PriorityModifier, TimePreference} from "../utils/Preferences";
import {classTypeToCode, DataFetcher} from "../utils/DataFetcher";
import {DataCleaner} from "../utils/DataCleaner";


export const STARTING_GENERATING_SCHEDULE = 'STARTING_GENERATING_SCHEDULE';

export function requestSchedule() {
    return {
        type: STARTING_GENERATING_SCHEDULE,
        generating: true,
    }
}

export const FINISHED_GENERATING_SCHEDULE = 'FINISHED_GENERATING_SCHEDULE';

export function getGenerationResults(schedule) {
    return {
        type: FINISHED_GENERATING_SCHEDULE,
        generationResult: schedule,
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

export const INCREMENT_PROGRESS = "INCREMENT_PROGRESS";

export const SET_PROGRESS = "SET_PROGRESS";

export function setProgress(generatingProgress) {
    return {
        type: SET_PROGRESS,
        generatingProgress: generatingProgress
    }
}

export const GENERATE_SCHEDULE = "GENERATE_SCHEDULE";

export function generateSchedule(classData, conflicts, preferences) {
    return {
        type: GENERATE_SCHEDULE,
        classData: classData,
        conflicts: conflicts,
        preferences: preferences
    }
}

export const SET_TOTAL_POSSIBLE_NUM_SCHEDULE = "SET_TOTAL_POSSIBLE_NUM_SCHEDULE";

export function setTotalPossibleNumSchedule(num) {
    return {
        type: SET_TOTAL_POSSIBLE_NUM_SCHEDULE,
        totalNumPossibleSchedule: num
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

function handleSchedulePreferences(schedulePreferences, preferences) {
    // TODO fix this for defaults on not existing start and end time
    if (schedulePreferences.startPref && schedulePreferences.endPref) {
        let startTime = schedulePreferences.startPref.toDate();
        let endTime = schedulePreferences.endPref.toDate();
        preferences.push(new TimePreference(startTime, endTime));
    }

    let days = schedulePreferences.dayPref;
    if (days) {
        preferences.push(new DayPreference(days));
    }

    // for (let classTitle of Object.keys(schedulePreferences.instructorPref)) {
    //     let instructor = schedulePreferences.instructorPref[classTitle];
    //     if(!instructor)
    //         continue;
    //
    //     let priority = schedulePreferences.priorityPref[classTitle] ? schedulePreferences.priorityPref[classTitle] : 1;
    //     let applied = [];
    //     applied.push(new InstructorPreference(classTitle, k))
    //         preferencesToBeModified.push(new InstructorPreference(instructor));
    //     }
    //
    //     let priorityModifier = new PriorityModifier(Class, preferencesToBeModified, priority);
    //     // add preferences to the priority modifier
    //     preferences.push(priorityModifier);
    // }


}


function calculateMaxSize(classData) {
    return Object.keys(classData).reduce((accum, cur) => {
        return accum * classData[cur].length;
    }, 1);
}

function handleClassSpecificPreferences(selectedClasses, classSpecificPref) {
    let classTitles = selectedClasses.map(e => e.classTitle);

    return classTitles.reduce((accum, cur) => {
        return {
            ...accum,
            [cur]: classSpecificPref[cur]
        }
    }, {})
}

/**
 * This is in redux so we have hooks that determine the progress of generating the generationResult *
 * @param selectedClasses comes in as a dictionary so must convert to a list
 * @returns {Function}
 */

// in the future, consider adding default parameters for an IT test here
export function getSchedule(selectedClasses) {
    return async function (dispatch, getState) {
        // let redux know that we are creating a generationResult
        dispatch(requestSchedule());

        selectedClasses = Object.values(selectedClasses);


        let conflicts = {};
        // setting progress to 0 initially
        dispatch(setProgress(0));

        let schedulePreferences = getState().SchedulePreferences;
        let {globalPref, classSpecificPref} = schedulePreferences;
        classSpecificPref = handleClassSpecificPreferences(selectedClasses, classSpecificPref);

        let preferences = {
            globalPref: globalPref,
            classSpecificPref: classSpecificPref
        };


        // TODO handle preferences correctly and split up responsibility around SchduleGeneration

        // Class has very little data but the names
        // passes in data from UI
        /*
        for (let Class of selectedClasses) {
            handlePriority(Class, preferences);
            //handleConflicts(Class, conflicts);
        }
        */

        // data comes in the form of array of subsections
        let classData = await DataFetcher.fetchClassData(selectedClasses);
        // will put the data into
        // CSE 11 -> section 0 [subsection, subsection], section 1 [subsection, subsection]
        classData = DataCleaner.cleanData(classData);

        // putting number of possible schedules
        let size = calculateMaxSize(classData);

        // this is for progress bar purposes
        dispatch(setTotalPossibleNumSchedule(size));

        // tell middleware we want to create a generationResult with an action
        // this will allow the web worker to take over
        dispatch(generateSchedule(classData, conflicts, preferences));
    }
}

