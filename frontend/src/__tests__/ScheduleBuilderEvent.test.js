import React from 'react';
import {makeTimeInterval} from "../utils/time/TimeUtils";
import {shallow} from "enzyme";
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {setClassData, setCurrentSchedule} from "../actions/schedule/ScheduleActions";
import {addClass, enterInputMode} from "../actions/classinput/ClassInputActions";
import ScheduleBuilderEventContainer from "../components/schedule/builder/event/ScheduleBuilderEventContainer";

/**
 * For tests which set edit mode, because it has the async call onDepartmentChange, I want to wait for everything to
 * resolve before moving on in the test
 * @returns {Promise<any>}
 */
function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}

describe("Tests for schedule builder event", () => {
    let store;

    beforeEach((done) => {
        store = createStore(reducers, applyMiddleware(thunk));
        done();
    });

    const testData = [
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
            },
                {
                    id: "961434",
                    sectionNum: "CSE12$1",
                    subsections: [{
                        day: "Tu",
                        instructor: "Politz, Joseph Gibbs",
                        location: "YORK",
                        room: "115",
                        timeInterval: makeTimeInterval("17:00-17:50", "Tu"),
                        type: "DI",
                    }]
                }
            ]
        },
        {
            title: "CSE 11",
            number: "11",
            description: "Random class",
            department: "CSE",
            sections: [{
                id: "961434",
                sectionNum: "CSE11$0",
                subsections: [{
                    day: "Tu",
                    instructor: "Trando, Cameron",
                    location: "WLH",
                    room: "2001",
                    timeInterval: makeTimeInterval("17:00-17:50", "Tu"),
                    type: "DI",
                }]
            }]
        }
    ];

    const testSchedule = ["CSE12$0", "CSE11$0"];

    function addClassForTest(classTitle) {
        let transactionID = store.getState().ClassInput.transactionID;
        store.dispatch(addClass({classTitle: classTitle, transactionID: transactionID}, transactionID));
        // have to enter edit mode to get a new transaction ID
        store.dispatch(enterInputMode());
        return transactionID;
    }

    test("ScheduleBuilderEvent click changes the section num inside the current schedule to its section num", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const wrapper =
            shallow(
                <ScheduleBuilderEventContainer
                    classTitle="CSE 12"
                    sectionNum="CSE12$1"
                    store={store}
                />);
        let instance = wrapper.dive().instance();
        instance.onClick();
        await flushPromises();

        let state = store.getState().Schedule;
        chaiExpect(state.currentSchedule).to.have.members(["CSE11$0", "CSE12$1"]);
    });

    test("ScheduleBuilderEvent click does not change the section num inside the current schedule if " +
        "clicked section num is same as in schedule", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const wrapper =
            shallow(
                <ScheduleBuilderEventContainer
                    classTitle="CSE 12"
                    sectionNum="CSE12$0"
                    store={store}
                />);
        let instance = wrapper.dive().instance();
        instance.onClick();
        await flushPromises();

        let state = store.getState().Schedule;
        chaiExpect(state.currentSchedule).to.have.members(["CSE11$0", "CSE12$0"]);
    });

    test("ScheduleBuilderEvent click should enter edit mode", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const wrapper =
            shallow(
                <ScheduleBuilderEventContainer
                    classTitle="CSE 12"
                    sectionNum="CSE12$0"
                    store={store}
                />);

        chaiExpect(store.getState().ClassInput.editMode).to.equal(false);

        let instance = wrapper.dive().instance();
        instance.onClick();
        await flushPromises();

        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);
    });

    test("ScheduleBuilderEvent click should stay in edit mode if clicking another section", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const firstSection =
            shallow(
                <ScheduleBuilderEventContainer
                    classTitle="CSE 12"
                    sectionNum="CSE12$0"
                    store={store}
                />);

        chaiExpect(store.getState().ClassInput.editMode).to.equal(false);

        let firstInstance = firstSection.dive().instance();
        firstInstance.onClick();

        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);

        const secondSection =
            shallow(
                <ScheduleBuilderEventContainer
                    classTitle="CSE 12"
                    sectionNum="CSE12$1"
                    store={store}
                />);

        let secondInstance = secondSection.dive().instance();
        secondInstance.onClick();

        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);
    });

    test("ScheduleBuilderEvent click should stay in edit mode if clicking other sections and clicking back", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const firstSection =
            shallow(
                <ScheduleBuilderEventContainer
                    classTitle="CSE 12"
                    sectionNum="CSE12$0"
                    store={store}
                />);

        chaiExpect(store.getState().ClassInput.editMode).to.equal(false);

        let firstInstance = firstSection.dive().instance();
        firstInstance.onClick();

        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);

        const secondSection =
            shallow(
                <ScheduleBuilderEventContainer
                    classTitle="CSE 12"
                    sectionNum="CSE12$1"
                    store={store}
                />);

        let secondInstance = secondSection.dive().instance();
        secondInstance.onClick();

        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);

        firstInstance = firstSection.dive().instance();
        firstInstance.onClick();

        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);
    });

    test("ScheduleBuilderEvent click exits edit mode on double click", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const wrapper =
            shallow(
                <ScheduleBuilderEventContainer
                    classTitle="CSE 12"
                    sectionNum="CSE12$0"
                    store={store}
                />);

        chaiExpect(store.getState().ClassInput.editMode).to.equal(false);

        let instance = wrapper.dive().instance();
        instance.onClick();
        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);

        instance = wrapper.dive().instance();
        instance.onClick();
        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(false);
    });

    test("ScheduleBuilderEvent click sets section num on click", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const wrapper =
            shallow(
                <ScheduleBuilderEventContainer
                    classTitle="CSE 12"
                    sectionNum="CSE12$0"
                    store={store}
                />);

        let instance = wrapper.dive().instance();
        instance.onClick();
        await flushPromises();
        let sectionNum = store.getState().ScheduleBuilder.sectionNum;
        chaiExpect(sectionNum).to.equal("CSE12$0");
    });

    test("ScheduleBuilderEvent sets section num to null on double click", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const wrapper =
            shallow(
                <ScheduleBuilderEventContainer
                    classTitle="CSE 12"
                    sectionNum="CSE12$0"
                    store={store}
                />);

        let instance = wrapper.dive().instance();
        instance.onClick();
        await flushPromises();
        let sectionNum = store.getState().ScheduleBuilder.sectionNum;
        chaiExpect(sectionNum).to.equal("CSE12$0");
    });
});

