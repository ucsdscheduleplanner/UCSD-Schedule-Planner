import React from 'react';
import {SGWorker} from "../schedulegeneration/SGWorker";
import {makeTimeInterval} from "../utils/ClassUtils";


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

const testBareSection = {
    subsections: [testSubsection]
};

describe("Schedule preferences, specific and global", () => {

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

        test("Returns 0 if a subsection does not fall within the bounds", () => {
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
    });
});