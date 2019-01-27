import React from 'react';
import renderer from 'react-test-renderer';
import thunk from 'redux-thunk';
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import {setCourseNum, setCourseNums, setDepartment, setDepartments} from "../actions/classinput/ClassInputMutator";
import {getInputHandler as getReduxInputHandler} from "../actions/classinput/ClassInputHandler";
import {AutoComplete} from "primereact/components/autocomplete/AutoComplete";
import {mount} from 'enzyme';

function getInputHandler(store) {
    let fn = getReduxInputHandler();
    return fn(store.dispatch, store.getState);
}

// describe("ClassInput component", () => {
//     let store;
//
//     beforeEach((done) => {
//         store = createStore(reducers, applyMiddleware(thunk));
//         done();
//     });
//
//     test('Renders correctly with no props', () => {
//         const classInput = renderer.create(
//             <ClassInputContainer store={store}/>,
//         );
//         let tree = classInput.toJSON();
//         expect(tree).toMatchSnapshot();
//     });
//
//     test("Initialization", () => {
//         const classInput = mount(
//             <ClassInputContainer store={store}/>
//         );
//
//         let state = store.getState().ClassInput;
//
//         chaiExpect(state.instructors).to.have.lengthOf(0);
//         chaiExpect(state.types).to.have.lengthOf(0);
//         chaiExpect(state.transactionID).to.not.equal(null);
//     });
//
//     test('Can type in the department autocomplete and have it remember the input', () => {
//         const classInput = mount(
//             <ClassInputContainer store={store}/>
//         );
//
//         store.dispatch(setDepartments(["CSE"]));
//
//         store.dispatch(setDepartment("CS"));
//         chaiExpect(store.getState().ClassInput.department).to.equal("CS");
//
//         let department = classInput.find({id: "department"}).find(AutoComplete).instance();
//         chaiExpect(department.props.value).to.equal("CS");
//     });
//
//
//     test('Entering a valid department allows the user to enter course number', () => {
//         const classInput = mount(
//             <ClassInputContainer store={store}/>
//         );
//
//         let courseAutocomplete = classInput.find({id: "course-number"}).find(AutoComplete).instance();
//         chaiExpect(courseAutocomplete.props.disabled).to.equal(true);
//
//         store.dispatch(setDepartments(["CSE"]));
//         store.dispatch(setDepartment("CSE"));
//
//         chaiExpect(courseAutocomplete.props.disabled).to.equal(false);
//     });
//
//     test('Entering an invalid department keeps the course number autocomplete disabled', () => {
//         const classInput = mount(
//             <ClassInputContainer store={store}/>
//         );
//         store.dispatch(setDepartments(["Hello"]));
//         store.dispatch(setDepartment("CSE"));
//
//         let courseAutocomplete = classInput.find({id: "course-number"}).find(AutoComplete).instance();
//         chaiExpect(courseAutocomplete.props.disabled).to.equal(true);
//     });
//
//     test('Entering a valid course number opens up the instructor', () => {
//         const classInput = mount(
//             <ClassInputContainer store={store}/>
//         );
//         store.dispatch(setDepartments(["CSE"]));
//         store.dispatch(setCourseNums(["11"]));
//
//         store.dispatch(setDepartment("CSE"));
//         store.dispatch(setCourseNum("11"));
//
//         let instructor = classInput.find({id: "instructor"}).find(AutoComplete).instance();
//         chaiExpect(instructor.props.disabled).to.equal(false);
//     });
//
//     test('Entering an invalid course number keeps instructor autocomplete disabled', () => {
//         const classInput = mount(
//             <ClassInputContainer store={store}/>
//         );
//
//         store.dispatch(setDepartments(["CSE"]));
//         store.dispatch(setCourseNums(["11"]));
//
//         store.dispatch(setDepartment("CSE"));
//         store.dispatch(setCourseNum("12"));
//
//         let instructor = classInput.find({id: "instructor"}).find(AutoComplete).instance();
//         chaiExpect(instructor.props.disabled).to.equal(true);
//     });
//
//     /**
//      * Would write the case for irregular inputs when getting blank but cannot reproduce in a test, this is an issue with
//      * autocomplete on primereact
//      */
//     test('Getting suggestions for putting in course nums works correctly on regular inputs', () => {
//         const classInput = mount(
//             <ClassInputContainer store={store}/>
//         );
//
//         let inputHandler = getInputHandler(store);
//
//         store.dispatch(setDepartments(["CSE"]));
//         store.dispatch(setCourseNums(["11", "111", "1111", "21"]));
//
//         store.dispatch(setDepartment("CSE"));
//         inputHandler.onCourseNumChange("11");
//
//         let state = store.getState().ClassInput;
//         let departmentComponent = classInput.find(ClassInput).instance();
//         const result = departmentComponent.getCourseNumSuggestions(state.courseNum, state.courseNums);
//         chaiExpect(result).to.have.lengthOf(3);
//         chaiExpect(result).to.eql(["11", "111", "1111"]);
//     });
// });

