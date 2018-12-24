import {
    setClassSpecificPref,
    setDayPref,
    setEndPref,
    setGlobalPref,
    setStartPref
} from "./SchedulePreferenceMutator";
import {GlobalPreference} from "../../utils/preferences/GlobalPreference";
import {ClassSpecificPreference} from "../../utils/preferences/ClassSpecificPreference";
import {DayTime} from "../../utils/time/TimeUtils";

export class SchedulePreferenceInputHandler {

    constructor(dispatch, getSTate) {
        this.dispatch = dispatch;
        this.getState = getSTate;
    }

    buildGlobalPref() {
        let globalPref = new GlobalPreference();
        const state = this.getState().SchedulePreferences;

        // TODO do validation on start time and end time
        if (state.startPref) {
            // state.startPref is a moment object
            let momentStartPref = state.startPref.toDate();
            globalPref.startPref = new DayTime(momentStartPref).getDate();
        }

        // TODO fix so that all that matters is the hour on the date, not the actual date
        // TODO probably should be done in SimpleInterval
        if (state.endPref) {
            let momentEndPref = state.endPref.toDate();
            globalPref.endPref = new DayTime(momentEndPref).getDate();
        }

        if (state.dayPref)
            globalPref.dayPref = state.dayPref;

        console.log("RETURNING GLOBAL PREF");
        console.log(globalPref);
        return globalPref;
    }

    buildClassSpecificPref() {
        let classSpecificPref = new ClassSpecificPreference();

        let priority = this.getState().ClassInput.priority;
        if (priority)
            classSpecificPref.priority = priority;
        let instructor = this.getState().ClassInput.instructor;
        if (instructor)
            classSpecificPref.instructorPref = instructor;

        return classSpecificPref;
    }

    saveGlobalPref() {
        let globalPref = this.buildGlobalPref();
        this.dispatch(setGlobalPref(globalPref));
    }

    // no need for specific on change for class specific, just let ClassInput call this method
    setClassSpecificPref() {
        let classSpecificPref = this.buildClassSpecificPref();
        let state = this.getState().ClassInput;
        let classTitle = `${state.department} ${state.courseNum}`;
        this.dispatch(setClassSpecificPref(classTitle, classSpecificPref));
    }

    onStartTimeChange(newStart) {
        this.dispatch(setStartPref(newStart));
        this.saveGlobalPref();
    }

    onEndTimeChange(newEnd) {
        this.dispatch(setEndPref(newEnd));
        this.saveGlobalPref();
    }

    onDayChange(newDay) {
        this.dispatch(setDayPref(newDay));
        this.saveGlobalPref();
    }
}

export function getSchedulePreferenceInputHandler(dispatch = null, getState = null) {
    if (dispatch && getState)
        return new SchedulePreferenceInputHandler(dispatch, getState);

    return function (dispatch, getState) {
        return new SchedulePreferenceInputHandler(dispatch, getState);
    }
}

