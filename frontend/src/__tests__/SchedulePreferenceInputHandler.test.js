import React from 'react';
import {SGWorker} from "../schedulegeneration/SGWorker";
import {makeTimeInterval} from "../utils/time/TimeUtils";
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {setStartPref} from "../actions/schedulepreference/SchedulePreferenceMutator";
import moment from "moment";
import {SchedulePreferenceInputHandler} from "../actions/schedulepreference/SchedulePreferenceInputHandler";


function getGlobalPref(globalPref) {
    return new SGWorker().getGlobalPref(globalPref);
}

function getSpecificPref(specificPref) {
    return new SGWorker().getSpecificPref(specificPref);
}

const testSubsection = {
    day: "Tu",
    instructor: "Politz, Joseph Gibbs",
    location: "YORK",
    room: "115",
    timeInterval: makeTimeInterval("9:00-9:50", "Tu"),
    type: "DI",
};

const testSubsectionLE1 = {
    day: "Tu",
    instructor: "Politz, Joseph Gibbs",
    location: "YORK",
    room: "115",
    timeInterval: makeTimeInterval("15:00-15:50", "M"),
    type: "LE",
};

const testSubsectionLE2 = {
    day: "Tu",
    instructor: "Politz, Joseph Gibbs",
    location: "YORK",
    room: "115",
    timeInterval: makeTimeInterval("15:00-15:50", "W"),
    type: "LE",
};

const testSubsectionLE3 = {
    day: "Tu",
    instructor: "Politz, Joseph Gibbs",
    location: "YORK",
    room: "115",
    timeInterval: makeTimeInterval("15:00-15:50", "F"),
    type: "LE",
};

const testSection = {
    sectionNum: "TEST$0",
    subsections: [testSubsection, testSubsectionLE1, testSubsectionLE2, testSubsectionLE3]
};

const testClass = [
    {department: "TEST", sections: [testSection]}
];

const testBareSection = {
    classTitle: "CSE 12",
    subsections: [testSubsection]
};

describe("Schedule preference input handling", () => {
    let store;
    beforeEach((done) => {
        store = createStore(reducers, applyMiddleware(thunk));
        done();
    });

    test("Converts simple moment time objects to their correct date", () => {
        let dateString = 'Tue Feb 16 2010 15:34:23';
        let date = moment(dateString, 'ddd MMM D YYYY HH:mm:ss');

        store.dispatch(setStartPref(date));

        let inputHandler = new SchedulePreferenceInputHandler(store.dispatch, store.getState);
        const globalPref = inputHandler.buildGlobalPref();
        // has been converted to date
        const start = globalPref.startPref;

        chaiExpect(start.getHours()).to.equal(15);
        chaiExpect(start.getMinutes()).to.equal(34);
    });

    test("Converts PM moment time objects to their correct date", () => {
        let dateString = 'Tue Feb 16 2010 09:34:00';
        let date = moment(dateString, 'ddd MMM D YYYY HH:mm:ss');

        store.dispatch(setStartPref(date));

        let inputHandler = new SchedulePreferenceInputHandler(store.dispatch, store.getState);
        const globalPref = inputHandler.buildGlobalPref();
        // has been converted to date
        const start = globalPref.startPref;

        chaiExpect(start.getHours()).to.equal(9);
        chaiExpect(start.getMinutes()).to.equal(34);
    });
});