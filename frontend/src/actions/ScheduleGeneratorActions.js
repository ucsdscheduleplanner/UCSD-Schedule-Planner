import {classTypeToCode, DataFetcher} from "../utils/DataFetcher";
import {DataCleaner} from "../utils/DataCleaner";

export const START_GENERATING = 'START_GENERATING';
export const GENERATE_SCHEDULE = "GENERATE_SCHEDULE";
export const FINISH_GENERATING = 'FINISH_GENERATING';
export const UPDATE_WITH_GENERATION_RESULT = "UPDATE_WITH_GENERATION_RESULT";
export const SET_TOTAL_POSSIBLE_NUM_SCHEDULE = "SET_TOTAL_POSSIBLE_NUM_SCHEDULE";
export const INCREMENT_PROGRESS = "INCREMENT_PROGRESS";
export const SET_PROGRESS = "SET_PROGRESS";

export function startGenerating() {
    return {
        type: START_GENERATING,
        generating: true,
    }
}

export function finishedGenerating() {
    return {
        type: FINISH_GENERATING,
        generating: false,
    }
}

export function updateWithResult(result) {
    return {
        type: UPDATE_WITH_GENERATION_RESULT,
        generationResult: result,
    }
}

export function incrementProgress(val) {
    return {
        type: INCREMENT_PROGRESS,
        amount: val
    }
}

export function setProgress(generatingProgress) {
    return {
        type: SET_PROGRESS,
        generatingProgress: generatingProgress
    }
}


export function generateSchedule(classData, conflicts, preferences) {
    return {
        type: GENERATE_SCHEDULE,
        classData: classData,
        conflicts: conflicts,
        preferences: preferences
    }
}


export function setTotalPossibleNumSchedule(num) {
    return {
        type: SET_TOTAL_POSSIBLE_NUM_SCHEDULE,
        totalNumPossibleSchedule: num
    }
}

export class ScheduleGeneratorPreprocessor {
    constructor(dispatch, getState) {
        this.dispatch = dispatch;
        this.getState = getState;

        if(!dispatch)
            console.error("Dispatch is null, failing");
        if(!getState)
            console.error("getState is null, failing");

        this.selectedClasses = Object.values(this.getState().ClassList.selectedClasses);
    }

    processProgressBar() {
        this.dispatch(setProgress(0));

        console.log(this.classData);
        // putting number of possible schedules
        let size = this.calculateMaxSize();

        console.log(`Total number of possible schedules is ${size}`);
        // this is for progress bar purposes
        this.dispatch(setTotalPossibleNumSchedule(size));
    }

    processPreferences() {
        let schedulePreferences = this.getState().SchedulePreferences;
        let {globalPref, classSpecificPref} = schedulePreferences;

        // filtering class specific preferences based on those the user selected
        // this is because when removing a class, instead of having to deal with removing preferences, just let them be
        classSpecificPref = this.handleClassSpecificPreferences(this.selectedClasses, classSpecificPref);

        this.preferences = {
            globalPref: globalPref,
            classSpecificPref: classSpecificPref
        }
    }

    async processClassData() {
        let classData = await DataFetcher.fetchClassData(this.selectedClasses);
        console.log("DATA IS");
        console.log(classData);
        // will put the data into
        // CSE 11 -> section 0 [subsection, subsection], section 1 [subsection, subsection]
        classData = DataCleaner.cleanData(classData);

        this.classData = classData;
    }

    processConflicts() {
        this.conflicts = [];
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
    handleConflicts(Class, conflicts) {
        // class not guaranteed to have conflicts array populated
        if (Class.conflicts) {
            if (!(Class.classTitle in conflicts)) {
                conflicts[Class.classTitle] = [];
            }
            conflicts[Class.classTitle] = Class.conflicts.map((conflict) => classTypeToCode[conflict])
        }
    }

    calculateMaxSize() {
        return this.classData.reduce((accum, cur) => {
            return accum * cur.sections.length;
        }, 1);
    }

    handleClassSpecificPreferences(selectedClasses, classSpecificPref) {
        let classTitles = selectedClasses.map(e => e.classTitle);

        return classTitles.reduce((accum, cur) => {
            return {
                ...accum,
                [cur]: classSpecificPref[cur]
            }
        }, {})
    }

    async preprocess() {
        await this.processClassData();
        this.processPreferences();
        this.processConflicts();
        this.processProgressBar();

        return {
            classData: this.classData,
            preferences: this.preferences,
            conflicts: this.conflicts
        }
    }
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
        dispatch(startGenerating());

        let {classData, conflicts, preferences} = await new ScheduleGeneratorPreprocessor(dispatch, getState).preprocess();

        console.log(preferences);
        // tell middleware we want to create a generationResult with an action
        // this will allow the web worker to take over
        dispatch(generateSchedule(classData, conflicts, preferences));
    }
}

