import React from 'react';
import {makeTimeInterval} from "../utils/time/TimeUtils";
import {mount, shallow} from "enzyme";
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {setClassData, setCurrentSchedule} from "../actions/schedule/ScheduleActions";
import {addClass, enterInputMode} from "../actions/classinput/ClassInputActions";
import ScheduleBuilderEventContainer from "../components/schedule/builder/event/ScheduleBuilderEventContainer";
import {setTransactionID} from "../actions/classinput/ClassInputMutator";
import {Provider} from "react-redux";

/**
 * For tests which set edit mode, because it has the async call onDepartmentChange, I want to wait for everything to
 * resolve before moving on in the test
 * @returns {Promise<any>}
 */
export function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}

describe("Tests for schedule builder event", () => {
    let store;

    beforeEach((done) => {
        store = createStore(reducers, applyMiddleware(thunk));
        done();
    });


    function mountScheduleBuilderEvent(props) {
        const wrapper = mount(
            <Provider store={store}>
                <ScheduleBuilderEventContainer {...props} />
            </Provider>
        );

        return wrapper.find(ScheduleBuilderEventContainer).children().instance();
    }

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

        const instance = mountScheduleBuilderEvent({classTitle: "CSE 12", sectionNum: "CSE12$1"});
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

        const instance = mountScheduleBuilderEvent({classTitle: "CSE 12", sectionNum: "CSE12$0"});
        instance.onClick();
        await flushPromises();

        let state = store.getState().Schedule;
        chaiExpect(state.currentSchedule).to.have.members(["CSE11$0", "CSE12$0"]);
    });

    test("ScheduleBuilderEvent click should enter edit mode", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        chaiExpect(store.getState().ClassInput.editMode).to.equal(false);

        const instance = mountScheduleBuilderEvent({classTitle: "CSE 12", sectionNum: "CSE12$0"});
        instance.onClick();
        await flushPromises();

        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);
    });

    test("ScheduleBuilderEvent click should stay in edit mode if clicking another section", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const firstInstance = mountScheduleBuilderEvent({classTitle: "CSE 12", sectionNum: "CSE12$0"});
        chaiExpect(store.getState().ClassInput.editMode).to.equal(false);
        firstInstance.onClick();

        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);

        const secondInstance = mountScheduleBuilderEvent({classTitle: "CSE 12", sectionNum: "CSE12$1"});
        secondInstance.onClick();

        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);
    });

    test("ScheduleBuilderEvent click should stay in edit mode if clicking other sections and clicking back", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const firstInstance = mountScheduleBuilderEvent({classTitle: "CSE 12", sectionNum: "CSE12$0"});
        chaiExpect(store.getState().ClassInput.editMode).to.equal(false);

        firstInstance.onClick();

        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);

        const secondInstance = mountScheduleBuilderEvent({classTitle: "CSE 12", sectionNum: "CSE12$1"});
        secondInstance.onClick();

        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);

        firstInstance.onClick();

        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);
    });

    test("ScheduleBuilderEvent click exits edit mode on double click", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const instance = mountScheduleBuilderEvent({classTitle: "CSE 12", sectionNum: "CSE12$0"});

        chaiExpect(store.getState().ClassInput.editMode).to.equal(false);

        instance.onClick();
        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(true);

        instance.onClick();
        await flushPromises();
        chaiExpect(store.getState().ClassInput.editMode).to.equal(false);
    });

    test("ScheduleBuilderEvent click sets section num on click", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));

        const instance = mountScheduleBuilderEvent({classTitle: "CSE 12", sectionNum: "CSE12$0"});
        instance.onClick();
        await flushPromises();
        let sectionNum = store.getState().ScheduleBuilder.sectionNum;
        chaiExpect(sectionNum).to.equal("CSE12$0");
    });

    test("ScheduleBuilderEvent sets section num to null on double click", async () => {
        let transactionID = addClassForTest("CSE 12");
        store.dispatch(setClassData(testData));
        store.dispatch(setCurrentSchedule(testSchedule));


        const instance = mountScheduleBuilderEvent({classTitle: "CSE 12", sectionNum: "CSE12$0"});
        instance.onClick();

        await flushPromises();
        let sectionNum = store.getState().ScheduleBuilder.sectionNum;
        chaiExpect(sectionNum).to.equal("CSE12$0");
    });

    describe("ScheduleBuilderEvent sets section num in schedule on click", () => {

        test("Edge case with one event being a prefix of the other", async () => {
            let transactionID = addClassForTest("CSE 20");
            store.dispatch(setClassData(testData));

            let testSchedule1 = ["CSE20$0", "CSE209A$0", "CSE11$0"];
            store.dispatch(setCurrentSchedule(testSchedule1));
            store.dispatch(setTransactionID(transactionID));

            const instance = mountScheduleBuilderEvent({classTitle: "CSE 20", sectionNum: "CSE20$1"});
            instance.onClick();
            await flushPromises();

            const state = store.getState().Schedule;
            chaiExpect(state.currentSchedule).to.have.deep.members(["CSE20$1", "CSE209A$0", "CSE11$0"]);
        });
    })
});

