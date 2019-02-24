import {makeTimeInterval} from "../utils/time/TimeUtils";
import {ScheduleGeneratorPreprocessor} from "../actions/schedule/generation/ScheduleGenerationActions";
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {setClassSpecificPref} from "../actions/schedulepreference/SchedulePreferenceMutator";
import {addClass} from "../actions/classinput/ClassInputActions";
import {ignoreClassTypeCodes} from "../actions/class_types/ignore/IgnoreClassTypesActions";


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

    const malformedInputNoSections = [
        {
            title: "CSE 12",
            number: "12",
            description: "Basic Data Struct & OO Design  ( 4Units)",
            department: "CSE",
            sections: [],
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

    test("Number of possible schedules gracefully fails on malformed inputs", () => {
        const preprocessor = new ScheduleGeneratorPreprocessor(store.dispatch, store.getState);
        preprocessor.classData = malformedInputNoSections;

        preprocessor.processProgressBar();

        let state = store.getState().ScheduleGenerate;

        chaiExpect(state.totalNumPossibleSchedule).to.equal(1);
    });

    test("Filters out classes that are in the preference list but have not been selected", () => {
        store.dispatch(setClassSpecificPref("CSE 10", {test: "test"}));
        store.dispatch(setClassSpecificPref("CSE 9", {test: "test"}));
        store.dispatch(setClassSpecificPref("CSE 8", {test: "test"}));
        store.dispatch(setClassSpecificPref("CSE 11", {test: "test"}));
        store.dispatch(setClassSpecificPref("CSE 12", {test: "test"}));
        store.dispatch(setClassSpecificPref("DSC 20", {test: "test"}));
        store.dispatch(addClass({classTitle: "CSE 11"}));
        store.dispatch(addClass({classTitle: "CSE 12"}));
        store.dispatch(addClass({classTitle: "DSC 20"}));

        const preprocessor = new ScheduleGeneratorPreprocessor(store.dispatch, store.getState);
        preprocessor.processPreferences();

        let preferences = preprocessor.preferences;
        chaiExpect(Object.keys(preferences.classSpecificPref)).to.have.lengthOf(3);
        chaiExpect(Object.keys(preferences.classSpecificPref)).to.eql(["CSE 11", "CSE 12", "DSC 20"]);
    });

    test("Assigns the correct value for classTypesToIgnore", () => {
        store.dispatch(ignoreClassTypeCodes("CSE 11", ["LE", "DI"]));

        const preprocessor = new ScheduleGeneratorPreprocessor(store.dispatch, store.getState);
        preprocessor.processClassTypesToIgnore();

        chaiExpect(preprocessor.classTypesToIgnore["CSE 11"]).eql(["LE", "DI"]);
    });
});
