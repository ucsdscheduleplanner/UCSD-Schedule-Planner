import React from 'react';
import ScheduleBuilderContainer from "../components/schedule/builder/ScheduleBuilderContainer";
import {makeTimeInterval} from "../utils/time/TimeUtils";
import {mount, shallow} from "enzyme";
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {setClassData, setCurrentSchedule} from "../actions/schedule/ScheduleActions";
import {setTransactionID} from "../actions/classinput/ClassInputMutator";
import {addClass} from "../actions/classinput/ClassInputActions";
import ClassUtils from "../utils/class/ClassUtils";
import {Provider} from "react-redux";

describe("Schedule building", () => {
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

    function mountScheduleBuilder() {
        const wrapper = mount(
            <Provider store={store}>
                <ScheduleBuilderContainer/>
            </Provider>
        );

        return wrapper.find(ScheduleBuilderContainer).children().instance();
    }

    const testSchedule = ["CSE12$0", "CSE11$0"];

    function addClassForTest(classTitle) {
        let transactionID = store.getState().ClassInput.transactionID;
        store.dispatch(addClass({classTitle: classTitle}, transactionID));
        return transactionID;
    }

    test("Displayed classes is correct with no classes", () => {
        const instance = mountScheduleBuilder();

        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setTransactionID(transactionID));
        store.dispatch(setClassData(testData));


        let displayedSchedule = instance.getDisplayedSchedule();
        chaiExpect(displayedSchedule).to.have.lengthOf(2);
        chaiExpect(displayedSchedule[0]).to.equal("CSE12$0");
    });

    test("Displayed classes should merge the classes in the schedule with the classes from classData", () => {
        const instance = mountScheduleBuilder();
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setTransactionID(transactionID));
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        let displayedSchedule = instance.getDisplayedSchedule();
        chaiExpect(displayedSchedule).to.have.lengthOf(3);
        chaiExpect(displayedSchedule).to.have.members(["CSE11$0", "CSE12$0", "CSE12$1"]);
    });

    test("Can dedupe events correctly", () => {
        const instance = mountScheduleBuilder();
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setTransactionID(transactionID));
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const displayedSchedule = instance.getDisplayedSchedule();
        const displayedEventsInfo = ClassUtils.getEventInfo(displayedSchedule, testData);
        const dedupeEventsInfo = instance.dedupeEventsInfo(displayedEventsInfo);
        chaiExpect(dedupeEventsInfo).to.have.lengthOf(2);
    });
});
