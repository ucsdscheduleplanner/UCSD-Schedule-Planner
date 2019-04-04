import React from 'react';
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {setClassData, setCurrentSchedule} from "../actions/schedule/ScheduleActions";
import {setTransactionID} from "../actions/classinput/ClassInputMutator";
import ClassUtils from "../utils/class/ClassUtils";
import {addClassForTest, mountScheduleBuilder, testData, testSchedule} from "./utils/ScheduleBuidlerTestUtils";

describe("Schedule building", () => {
    let store;

    beforeEach((done) => {
        store = createStore(reducers, applyMiddleware(thunk));
        done();
    });

    test("Displayed classes is correct with no classes", () => {
        const instance = mountScheduleBuilder(store);

        let transactionID = addClassForTest("CSE 12", store);
        store.dispatch(setTransactionID(transactionID));
        store.dispatch(setClassData(testData));


        let displayedSchedule = instance.getDisplayedSchedule();
        chaiExpect(displayedSchedule).to.have.lengthOf(2);
        chaiExpect(displayedSchedule[0]).to.equal("CSE12$0");
    });

    test("Displayed classes should merge the classes in the schedule with the classes from classData", () => {
        const instance = mountScheduleBuilder(store);
        let transactionID = addClassForTest("CSE 12", store);
        store.dispatch(setTransactionID(transactionID));
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        let displayedSchedule = instance.getDisplayedSchedule();
        chaiExpect(displayedSchedule).to.have.lengthOf(3);
        chaiExpect(displayedSchedule).to.have.members(["CSE11$0", "CSE12$0", "CSE12$1"]);
    });

    test("Can dedupe events correctly", () => {
        const instance = mountScheduleBuilder(store);
        let transactionID = addClassForTest("CSE 12", store);
        store.dispatch(setTransactionID(transactionID));
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const displayedSchedule = instance.getDisplayedSchedule();
        const displayedEventsInfo = ClassUtils.getEventInfo(displayedSchedule, testData);
        const dedupeEventsInfo = instance.dedupeEventsInfo(displayedEventsInfo);

        console.log(dedupeEventsInfo);
        chaiExpect(dedupeEventsInfo).to.have.lengthOf(2);
    });
});
