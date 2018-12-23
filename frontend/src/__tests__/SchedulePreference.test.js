import React from 'react';
import {SGWorker} from "../schedulegeneration/SGWorker";
import {makeTimeInterval} from "../utils/time/TimeUtils";
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";


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

describe("Schedule preferences, specific and global", () => {
    let store;
    beforeEach((done) => {
        store = createStore(reducers, applyMiddleware(thunk));
        done();
    });

    test("Global preferences work on empty input", () => {
        let globalPref = getGlobalPref(null);
        let score = globalPref.evaluate(testBareSection);

        chaiExpect(score).to.equal(0);
    });

    test("Specific class preferences work on empty input", () => {
        let specificPref = getSpecificPref(null);
        let score = specificPref.evaluate(testBareSection);

        chaiExpect(score).to.equal(0);
    });

    describe("Global preferences", () => {
        test("Times work when section falls within bounds", () => {
            let startTime = new Date();
            startTime.setHours(8);
            let endTime = new Date();
            endTime.setHours(12);

            const pref = {
                startPref: startTime,
                endPref: endTime
            };

            let globalPref = getGlobalPref(pref);
            let score = globalPref.evaluateTime(testSubsection);

            chaiExpect(score).to.be.at.least(1);
        });

        test("Times work when section falls within bounds", () => {
            let startTime = new Date();
            startTime.setHours(8);
            let endTime = new Date();
            endTime.setHours(12);

            const pref = {
                startPref: startTime,
                endPref: endTime
            };

            let globalPref = getGlobalPref(pref);
            let score = globalPref.evaluateTime(testSubsection);

            chaiExpect(score).to.be.at.least(1);
        });

        test("Returns 0 if a subsection does not fall within the time bounds", () => {
            let startTime = new Date();
            startTime.setHours(10);
            let endTime = new Date();
            endTime.setHours(12);

            const pref = {
                startPref: startTime,
                endPref: endTime
            };

            let globalPref = getGlobalPref(pref);
            let score = globalPref.evaluateTime(testSubsection);

            chaiExpect(score).to.equal(0);
        });

        test("Returns a positive number if a subsection falls within the day bounds", () => {
            const pref = {
                dayPref: ["Tu"]
            };

            let globalPref = getGlobalPref(pref);
            let score = globalPref.evaluateDay(testSubsection);

            chaiExpect(score).to.be.at.least(1);
        });

        test("Returns 0 if a subsection does not fall within the day bounds", () => {
            const pref = {
                dayPref: ["Th"]
            };

            let globalPref = getGlobalPref(pref);
            let score = globalPref.evaluateDay(testSubsection);

            chaiExpect(score).to.equal(0);
        });

        test("Returns positive number if some of the subsections fall in the area", () => {
            let startTime = new Date();
            startTime.setHours(9);
            startTime.setMinutes(0);
            let endTime = new Date();
            endTime.setHours(17);
            endTime.setMinutes(0);

            let globalPref = {
                startPref: startTime,
                endPref: endTime
            };

            let sPref = new SGWorker().getSpecificPref(null);
            let gPref = new SGWorker().getGlobalPref(globalPref);

            let scheduleGenerator = new SGWorker().getScheduleGenerator({
                classData: testClass,
                specificPref: sPref,
                globalPref: gPref,
                conflicts: []
            });
            let score = scheduleGenerator.evaluateSchedule(["TEST$0"]);

            chaiExpect(score).to.be.at.least(1);
        });

        test('Defaults to 9 to 5 when nothing is set', () => {
            let state = store.getState().SchedulePreferences;
            let sPref = new SGWorker().getSpecificPref(null);
            let gPref = new SGWorker().getGlobalPref(state.globalPref);

            let scheduleGenerator = new SGWorker().getScheduleGenerator({
                classData: testClass,
                specificPref: sPref,
                globalPref: gPref,
                conflicts: []
            });

            let score = scheduleGenerator.evaluateSchedule(["TEST$0"]);
            chaiExpect(score).to.be.at.least(1);
        });
    });


    describe("Class specific preferences", () => {
        test('Instructor preferences return positive number when instructor matches', () => {
            let sPref = {
                "CSE 12": {
                    instructorPref: "Politz, Joseph Gibbs",
                }
            };

            let specificPref = getSpecificPref(sPref);
            let score = specificPref.evaluate(testBareSection, "CSE 12");

            chaiExpect(score).to.be.at.least(1);
        });

        test('Instructor preferences return 0 when instructor does not match', () => {
            let sPref = {
                "CSE 12": {
                    instructorPref: "Bary Billespie",
                }
            };

            let specificPref = getSpecificPref(sPref);
            let score = specificPref.evaluate(testBareSection, "CSE 12");

            chaiExpect(score).to.equal(0);
        });
    });
});