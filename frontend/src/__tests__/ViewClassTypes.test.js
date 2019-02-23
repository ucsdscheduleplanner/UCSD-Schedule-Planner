import React from 'react';
import thunk from "redux-thunk";
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import {getInputHandler} from "../actions/classinput/ClassInputHandler";
import {TESTING_viewClassTypeCodes} from "../actions/class_types/view/ViewClassTypesActions";
import {flushPromises} from "./ScheduleBuilderEvent.test";
import {setCourseNums, setDepartments, setTypes} from "../actions/classinput/ClassInputMutator";
import {DataFetcher} from "../utils/DataFetcher";
import {setClassData, setCurrentSchedule} from "../actions/schedule/ScheduleActions";
import {addClassForTest, mountScheduleBuilder, testData, testSchedule} from "./utils/ScheduleBuidlerTestUtils";
import {mountScheduleGenerator} from "./utils/ScheduleGeneratorTestUtils";

function getInputHandlerForTest(store) {
    let fn = getInputHandler();
    return fn(store.dispatch, store.getState);
}

describe("View Class Types components and logic surrounding it", () => {
    let store;
    beforeEach((done) => {
        store = createStore(reducers, applyMiddleware(thunk));
        DataFetcher.fetchClassSummaryFor = (department) => {
            return new Promise((resolve, reject) => {
                resolve(
                    {
                        courseNums: ["11", "12"],
                        instructorsPerClass: {"11": ["Joseph Politz", "Rick Ord"]},
                        classTypesPerClass: {"11": ["LE", "DI"], "12": ["LE"]},
                        descriptionsPerClass: {}
                    }
                )
            });
        };

        done();
    });

    test("Default value is empty object", () => {
        let state = store.getState().ViewClassTypes;
        chaiExpect(Object.keys(state.classMapping)).to.have.lengthOf(0);
    });

    test("Updates class mapping appropriately on direct setting", () => {
        store.dispatch(TESTING_viewClassTypeCodes("CSE 12", ["LE", "DI"]));

        let state = store.getState().ViewClassTypes;
        chaiExpect(Object.keys(state.classMapping)).to.have.lengthOf(1);
        chaiExpect(Object.keys(state.classMapping)[0]).to.equal("CSE 12");


        let actualClasses = state.classMapping["CSE 12"];

        chaiExpect(actualClasses).to.have.lengthOf(2);
        chaiExpect(actualClasses).to.have.members(["LE", "DI"]);
    });

    test("Class input handler updates classes correctly", async () => {
        store.dispatch(setDepartments(["CSE"]));
        store.dispatch(setCourseNums(["11", "12"]));
        store.dispatch(setTypes(["LE", "DI"]));

        let inputHandler = getInputHandlerForTest(store);
        await inputHandler.onDepartmentChange("CSE");
        flushPromises();
        inputHandler.onCourseNumChange("11");

        inputHandler.onViewClassTypes(["LE"]);

        let state = store.getState().ViewClassTypes;
        chaiExpect(Object.keys(state.classMapping)).to.have.lengthOf(1);
        chaiExpect(Object.keys(state.classMapping)[0]).to.equal("CSE 11");

        let actualClasses = state.classMapping["CSE 11"];
        chaiExpect(actualClasses).to.have.lengthOf(1);
        chaiExpect(actualClasses[0]).to.equal("LE");
    });

    test("Displayed classes on schedule builder calendar are only those that are checked on view class types component", () => {
        let scheduleBuilder = mountScheduleBuilder(store);
        addClassForTest("CSE 12", store);

        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        store.dispatch(TESTING_viewClassTypeCodes("CSE 12", ["LE"]));
        store.dispatch(TESTING_viewClassTypeCodes("CSE 11", ["LE"]));

        let schedule = scheduleBuilder.getDisplayedSchedule();
        let displayedClassInfo = scheduleBuilder.getDisplayedEventInfo(schedule);

        for (let classInfo of displayedClassInfo) {
            console.log(classInfo);
            chaiExpect(classInfo.type).to.equal("LE");
        }
    });

    test("Displayed classes on schedule generator calendar are only those that are checked on view class types component", () => {
        let scheduleGenerator = mountScheduleGenerator(store);
        addClassForTest("CSE 12", store);

        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        store.dispatch(TESTING_viewClassTypeCodes("CSE 12", ["LE"]));
        store.dispatch(TESTING_viewClassTypeCodes("CSE 11", ["LE"]));

        let displayedClassInfo = scheduleGenerator.getDisplayedEventInfo(testSchedule);

        for (let classInfo of displayedClassInfo) {
            console.log(classInfo);
            chaiExpect(classInfo.type).to.equal("LE");
        }
    });
});
