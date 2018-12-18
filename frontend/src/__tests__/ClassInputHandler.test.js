import React from 'react';
import ClassInputContainer from "../containers/ClassInputContainer";
import {setConflicts, setCourseNum, setDepartment, setDepartments, setInstructor} from "../actions/ClassInputMutator";
import {getInputHandler as getReduxInputHandler} from "../actions/ClassInputHandler";
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {mount} from 'enzyme';

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
        const classInput = mount(
            <ClassInputContainer store={store}/>
        );

        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));

        let inputHandler = getInputHandler(store);

        const newClass = inputHandler.buildClassFromInput();
        const result = {
            classTitle: "CSE 12",
            department: "CSE",
            courseNum: "12",
            conflicts: [],
            instructor: null
        };

        chaiExpect(result).to.eql(newClass);
    });

    test('Creates a more complex class from input', () => {
        const classInput = mount(
            <ClassInputContainer store={store}/>
        );

        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));
        store.dispatch(setConflicts(["LE", "blah"]));
        store.dispatch(setInstructor("Mr. Cameron Trando"));

        let inputHandler = getInputHandler(store);

        const newClass = inputHandler.buildClassFromInput();
        const result = {
            classTitle: "CSE 12",
            department: "CSE",
            courseNum: "12",
            conflicts: ["LE", "blah"],
            instructor: "Mr. Cameron Trando"
        };

        chaiExpect(result).to.eql(newClass);
    });

    test('Making sure other fields are nulled out when changing department field', () => {
        const classInput = mount(
            <ClassInputContainer store={store}/>
        );

        store.dispatch(setDepartments(["CSE", "DSC"]));
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));
        store.dispatch(setConflicts(["LE", "blah"]));
        store.dispatch(setInstructor("Mr. Cameron Trando"));

        let inputHandler = getInputHandler(store);
        inputHandler.onDepartmentChange("DSC");

        let state = store.getState().ClassInput;

        chaiExpect(state.department).to.equal("DSC");
        chaiExpect(state.courseNum).to.equal(null);
        chaiExpect(state.instructor).to.equal(null);
        chaiExpect(state.conflicts).to.eql([]);
    });

    test('Making sure other fields are not nulled out if department field is edited but its value is not altered', () => {
        const classInput = mount(
            <ClassInputContainer store={store}/>
        );

        store.dispatch(setDepartments(["CSE", "DSC"]));
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));
        store.dispatch(setConflicts(["LE", "blah"]));
        store.dispatch(setInstructor("Mr. Cameron Trando"));

        let inputHandler = getInputHandler(store);
        inputHandler.onDepartmentChange("CSE");

        let state = store.getState().ClassInput;

        chaiExpect(state.department).to.equal("CSE");
        chaiExpect(state.courseNum).to.equal("12");
        chaiExpect(state.instructor).to.equal("Mr. Cameron Trando");
        chaiExpect(state.conflicts).to.eql(["LE", "blah"]);
    });
});
