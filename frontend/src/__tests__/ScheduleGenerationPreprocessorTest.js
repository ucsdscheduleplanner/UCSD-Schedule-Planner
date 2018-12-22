import {makeTimeInterval} from "../utils/ClassUtils";
import {ScheduleGeneratorPreprocessor} from "../actions/ScheduleGenerationActions";
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";


describe("Tests how the information is built up before schedule is generated", () => {
    const testInput = [
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
        }
    ];

    let store;

    beforeEach(() => {
        store = createStore(reducers, applyMiddleware(thunk));
    });

    test("Number of possible schedules is set correctly", () => {
        const preprocessor = new ScheduleGeneratorPreprocessor(store.dispatch, store.getState);
        preprocessor.classData = testInput;

        preprocessor.processProgressBar();

        let state = store.getState().ScheduleGenerate;

        chaiExpect(state.totalNumPossibleSchedule).to.equal(1);
    });
});