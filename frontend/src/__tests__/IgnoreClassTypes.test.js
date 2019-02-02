import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {ignoreClassTypeCodes, ignoreClassTypes} from "../actions/ignoreclasstypes/IgnoreClassTypesActions";
import {SGWorker} from "../utils/schedulegeneration/SGWorker";
import {makeTimeInterval} from "../utils/time/TimeUtils";

const testInput = {
    classData: [
        {
            title: "CSE 12",
            number: "12",
            description: "Basic Data Struct & OO Design  ( 4Units)",
            department: "CSE",
            sections: [{
                id: "961434",
                sectionNum: "CSE12$0",
                subsections: [{
                    day: "Tu",
                    instructor: "Politz, Joseph Gibbs",
                    location: "YORK",
                    room: "115",
                    timeInterval: makeTimeInterval("17:00-17:50", "Tu"),
                    type: "DI",
                }]
            }]
        },
        {
            title: "CSE 11",
            number: "11",
            description: "Test Class ( 4Units)",
            department: "CSE",
            sections: [{
                id: "2828382",
                sectionNum: "CSE11$0",
                subsections: [{
                    day: "Tu",
                    instructor: "Cameron Trando",
                    location: "YORK",
                    room: "115",
                    timeInterval: makeTimeInterval("17:00-17:50", "Tu"),
                    type: "DI",
                }]
            }]
        }
    ],
    conflicts: [],
    preferences: []
};

const moreComplexInput = {
    classData: [
        {
            title: "CSE 12",
            number: "12",
            description: "Basic Data Struct & OO Design  ( 4Units)",
            department: "CSE",
            sections: [
                {
                    id: "961434",
                    sectionNum: "CSE12$0",
                    subsections: [
                        {
                            day: "Tu",
                            instructor: "Politz, Joseph Gibbs",
                            location: "YORK",
                            room: "115",
                            timeInterval: makeTimeInterval("17:00-17:50", "Tu"),
                            type: "DI",
                        },
                    ]
                },
                {
                    id: "961434",
                    sectionNum: "CSE12$1",
                    subsections: [
                        {
                            day: "Tu",
                            instructor: "Politz, Joseph Gibbs",
                            location: "YORK",
                            room: "115",
                            timeInterval: makeTimeInterval("12:00-12:50", "Tu"),
                            type: "DI",
                        },
                    ]
                }
            ]
        },
        {
            title: "CSE 11",
            number: "11",
            description: "Test Class ( 4Units)",
            department: "CSE",
            sections: [
                {
                    id: "2828382",
                    sectionNum: "CSE11$0",
                    subsections: [{
                        day: "Tu",
                        instructor: "Cameron Trando",
                        location: "YORK",
                        room: "115",
                        timeInterval: makeTimeInterval("17:00-17:50", "Tu"),
                        type: "DI",
                    }]
                },
                {
                    id: "2828382",
                    sectionNum: "CSE11$1",
                    subsections: [{
                        day: "Tu",
                        instructor: "Cameron Trando",
                        location: "YORK",
                        room: "115",
                        timeInterval: makeTimeInterval("12:00-12:50", "Tu"),
                        type: "DI",
                    }]
                }
            ]
        }
    ],
    conflicts: [],
    preferences: []
};

describe("Setting class types to ignore", () => {
    let store;
    beforeEach((done) => {
        store = createStore(reducers, applyMiddleware(thunk));
        done();
    });

    test("Can ignore class types correctly", () => {
        store.dispatch(ignoreClassTypeCodes("CSE 11", ["LE", "DI"]));

        let state = store.getState().IgnoreClassTypes;
        chaiExpect(state.classMapping["CSE 11"]).to.eql(["LE", "DI"]);
    });

    test("Can generate a schedule even on a conflict", () => {
        let copy = Object.assign({}, testInput);
        copy.classTypesToIgnore = {
            "CSE 11": ["LE", "DI"]
        };

        let worker = new SGWorker();
        let result = worker.generate(copy);

        // making sure the schedule could generate
        chaiExpect(result.schedules).to.have.lengthOf(1);
        chaiExpect(Object.keys(result.errors)).to.have.lengthOf(0);
    });

    test("Can generate a schedule with more complex inputs on more conflicts", () => {
        let copy = Object.assign({}, moreComplexInput);
        copy.classTypesToIgnore = {
            "CSE 11": ["LE", "DI"]
        };

        let worker = new SGWorker();
        let result = worker.generate(copy);

        // making sure the schedule could generate
        chaiExpect(result.schedules.length).to.be.at.least(1);
        chaiExpect(Object.keys(result.errors)).to.have.lengthOf(0);
    });
});