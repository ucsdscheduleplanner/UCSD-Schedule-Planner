import React from 'react';
import {
    setClassTypesToIgnore,
    setCourseNum,
    setCourseNums,
    setDepartment,
    setDepartments,
    setInstructor
} from "../actions/classinput/ClassInputMutator";
import {getInputHandler as getReduxInputHandler} from "../actions/classinput/ClassInputHandler";
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {enterEditMode} from "../actions/classinput/ClassInputActions";
import {DataFetcher} from "../utils/DataFetcher";

function getInputHandler(store) {
    let fn = getReduxInputHandler();
    return fn(store.dispatch, store.getState);
}

describe("Ensuring ClassInputHandler can handle changes in the autocomplete fields correctly", () => {
    let store;

    beforeEach((done) => {
        store = createStore(reducers, applyMiddleware(thunk));
        done();
    });

    test('Creates a very bare class from input with just department and course number', () => {
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));

        let inputHandler = getInputHandler(store);

        const newClass = inputHandler.buildClassFromInput();
        const expected = {
            classTitle: "CSE 12",
            department: "CSE",
            courseNum: "12",
            classTypesToIgnore: [],
            priority: null,
            instructor: null,
        };

        chaiExpect(newClass).to.deep.include(expected);
    });

    test('Creates a more complex class from input', () => {
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));
        store.dispatch(setClassTypesToIgnore(["LE", "blah"]));
        store.dispatch(setInstructor("Mr. Cameron Trando"));

        let inputHandler = getInputHandler(store);

        const result = inputHandler.buildClassFromInput();
        const expected = {
            classTitle: "CSE 12",
            department: "CSE",
            courseNum: "12",
            classTypesToIgnore: ["LE", "blah"],
            priority: null,
            instructor: "Mr. Cameron Trando"
        };

        chaiExpect(result).to.deep.include(expected);
    });

    test('Making sure other fields are nulled out when changing department field', async () => {
        store.dispatch(setDepartments(["CSE", "DSC"]));
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));
        store.dispatch(setClassTypesToIgnore(["LE", "blah"]));
        store.dispatch(setInstructor("Mr. Cameron Trando"));

        let inputHandler = getInputHandler(store);

        // mock function
        DataFetcher.fetchClassSummaryFor = (department) => {
            return new Promise((resolve, reject) => {
                resolve(
                    {
                        courseNums: ["11", "12"],
                        instructorsPerClass: {"11": ["Joseph Politz", "Rick Ord"]},
                        classTypesPerClass: {},
                        descriptionsPerClass: {}
                    }
                )
            });
        };

        await inputHandler.onDepartmentChange("DSC");
        let state = store.getState().ClassInput;

        chaiExpect(state.department).to.equal("DSC");
        chaiExpect(state.courseNum).to.equal(null);
        chaiExpect(state.instructor).to.equal(null);
        chaiExpect(state.classTypesToIgnore).to.eql([]);
    });

    test('Making sure priority, ignored class types, and instructors are nulled out when changing courseNum field', () => {
        store.dispatch(setDepartments(["CSE", "DSC"]));
        store.dispatch(setCourseNums(["11", "12"]));
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));
        store.dispatch(setClassTypesToIgnore(["LE", "blah"]));
        store.dispatch(setInstructor("Mr. Cameron Trando"));

        let inputHandler = getInputHandler(store);
        inputHandler.onCourseNumChange("11");

        let state = store.getState().ClassInput;

        // department should still stay the same
        chaiExpect(state.department).to.equal("CSE");
        chaiExpect(state.courseNum).to.equal("11");
        chaiExpect(state.instructor).to.equal(null);
        chaiExpect(state.classTypesToIgnore).to.eql([]);
    });

    test('Instructor, types, and priority are unchanged when trying to change the courseNum to something that is not in the courseNums list', () => {
        store.dispatch(setDepartments(["CSE", "DSC"]));
        store.dispatch(setCourseNums(["11", "12"]));
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));
        store.dispatch(setClassTypesToIgnore(["LE", "blah"]));
        store.dispatch(setInstructor("Mr. Cameron Trando"));

        let inputHandler = getInputHandler(store);
        inputHandler.onCourseNumChange("1222");

        let state = store.getState().ClassInput;

        // courseNum will change but others should still stay the same
        chaiExpect(state.courseNum).to.equal("1222");

        // department should still stay the same
        chaiExpect(state.department).to.equal("CSE");
        chaiExpect(state.instructor).to.equal("Mr. Cameron Trando");
        chaiExpect(state.classTypesToIgnore).to.eql(["LE", "blah"]);
    });

    test('Everything besides department is unchanged when trying to change the department to something that is not in the departments list', async () => {
        store.dispatch(setDepartments(["CSE", "DSC"]));
        store.dispatch(setCourseNums(["11", "12"]));
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));
        store.dispatch(setClassTypesToIgnore(["LE", "blah"]));
        store.dispatch(setInstructor("Mr. Cameron Trando"));

        let inputHandler = getInputHandler(store);
        await inputHandler.onDepartmentChange("CSEEEE");

        let state = store.getState().ClassInput;

        chaiExpect(state.department).to.equal("CSEEEE");

        chaiExpect(state.courseNum).to.equal("12");
        chaiExpect(state.instructor).to.equal("Mr. Cameron Trando");
        chaiExpect(state.classTypesToIgnore).to.eql(["LE", "blah"]);
    });

    describe("UI actions on class input operations", () => {
        it("Makes a popup occur when hitting remove class in ClassInput", async () => {
            store.dispatch(setDepartments(["CSE", "DSC"]));
            store.dispatch(setCourseNums(["11", "12"]));
            store.dispatch(setDepartment("CSE"));
            store.dispatch(setCourseNum("12"));

            let transactionID = store.getState().ClassInput.transactionID;

            let inputHandler = getInputHandler(store);
            inputHandler.handleAdd();

            // mock function
            DataFetcher.fetchClassSummaryFor = (department) => {
                return new Promise((resolve, reject) => {
                    resolve(
                        {
                            courseNums: ["11", "12"],
                            instructorsPerClass: {"11": ["Joseph Politz", "Rick Ord"]},
                            classTypesPerClass: {},
                            descriptionsPerClass: {}
                        }
                    )
                });
            };
            await store.dispatch(enterEditMode(transactionID));
            inputHandler.handleRemove();

            let state = store.getState().ClassInput;
            chaiExpect(state.messageHandler.messageQueue).to.have.lengthOf(1);
            chaiExpect(state.messageHandler.messageQueue[0]).to.match(/Removed/);
        });
    });
});
