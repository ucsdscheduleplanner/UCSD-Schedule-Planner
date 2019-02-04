import React from 'react';
import {
    setClassTypesToIgnore,
    setCourseNum,
    setCourseNums,
    setDepartment,
    setDepartments,
    setInstructor,
    setInstructors, setTypes
} from "../actions/classinput/ClassInputMutator";
import {applyMiddleware, createStore} from "redux";
import reducers from "../reducers";
import thunk from "redux-thunk";
import {getInputHandler as getReduxInputHandler} from "../actions/classinput/ClassInputHandler";
import {enterEditMode, enterInputMode, populateDataPerClass} from "../actions/classinput/ClassInputActions";
import {DataFetcher} from "../utils/DataFetcher";

function getInputHandler(store) {
    let fn = getReduxInputHandler();
    return fn(store.dispatch, store.getState);
}

describe("ClassInput actions such as adding, editing and removing classes", () => {
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

    test('Can add a class successfully', () => {
        store.dispatch(setDepartments(["CSE", "DSC"]));
        store.dispatch(setCourseNums(["11", "12"]));
        store.dispatch(setInstructors(["Mr. Cameron Trando"]));
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));
        store.dispatch(setClassTypesToIgnore(["LE", "blah"]));
        store.dispatch(setInstructor("Mr. Cameron Trando"));

        let inputHandler = getInputHandler(store);
        let transactionID = store.getState().ClassInput.transactionID;
        inputHandler.handleAdd();

        let classList = store.getState().ClassList;
        chaiExpect(Object.keys(classList.selectedClasses)).to.have.lengthOf(1);
        let addedClass = classList.selectedClasses[transactionID];

        const expected = {
            classTitle: "CSE 12",
            department: "CSE",
            courseNum: "12",
            classTypesToIgnore: ["LE", "blah"],
            priority: null,
            instructor: "Mr. Cameron Trando"
        };

        chaiExpect(addedClass).to.deep.include(expected)
    });

    test('Cannot add duplicate classes', () => {
        // making first class
        store.dispatch(setDepartments(["CSE", "DSC"]));
        store.dispatch(setCourseNums(["11", "12"]));
        store.dispatch(setInstructors(["Mr. Cameron Trando"]));

        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));
        store.dispatch(setClassTypesToIgnore(["LE", "blah"]));
        store.dispatch(setInstructor("Mr. Cameron Trando"));


        let inputHandler = getInputHandler(store);
        inputHandler.handleAdd();

        // making second class
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));
        store.dispatch(setClassTypesToIgnore(["LE", "blah"]));
        store.dispatch(setInstructor("Mr. Cameron Trando"));

        // adding again
        inputHandler.handleAdd();

        let classList = store.getState().ClassList;
        chaiExpect(Object.keys(classList.selectedClasses)).to.have.lengthOf(1);
    });

    test('Can add multiple classes', () => {
        // making first class
        store.dispatch(setDepartments(["CSE", "DSC"]));
        store.dispatch(setCourseNums(["11", "12"]));
        store.dispatch(setInstructors(["Mr. Cameron Trando"]));

        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("12"));
        store.dispatch(setClassTypesToIgnore(["LE", "blah"]));
        store.dispatch(setInstructor("Mr. Cameron Trando"));

        let inputHandler = getInputHandler(store);
        inputHandler.handleAdd();

        // making second class
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("11"));

        // adding again
        inputHandler.handleAdd();

        let classList = store.getState().ClassList;
        chaiExpect(Object.keys(classList.selectedClasses)).to.have.lengthOf(2);
    });

    test('Duplicate checking only looks at the class title', () => {
        // making first class
        store.dispatch(setDepartments(["CSE"]));
        store.dispatch(setCourseNums(["11"]));
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("11"));
        // adding first class
        let inputHandler = getInputHandler(store);
        inputHandler.handleAdd();
        // making second class
        store.dispatch(setDepartment("CSE"));
        store.dispatch(setCourseNum("11"));
        // adding again
        inputHandler.handleAdd();

        let classList = store.getState().ClassList;
        chaiExpect(Object.keys(classList.selectedClasses)).to.have.lengthOf(1);
    });

    describe("Editing classes", () => {
        test('Can edit a simple class correctly', async () => {
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

            // making first class
            store.dispatch(setDepartments(["CSE", "DSC"]));
            store.dispatch(setCourseNums(["11", "12"]));

            store.dispatch(setDepartment("CSE"));
            store.dispatch(setCourseNum("11"));

            let inputHandler = getInputHandler(store);
            let transactionID = store.getState().ClassInput.transactionID;
            inputHandler.handleAdd();

            await store.dispatch(enterEditMode(transactionID));

            // making second class
            await inputHandler.onDepartmentChange("DSC");
            inputHandler.onCourseNumChange("11");

            // adding again
            inputHandler.handleEdit();

            // returning back to input mode
            await store.dispatch(enterInputMode());

            let classList = store.getState().ClassList;
            chaiExpect(Object.keys(classList.selectedClasses)).to.have.lengthOf(1);

            const expected = {
                classTitle: "DSC 11",
                department: "DSC",
                courseNum: "11",
                classTypesToIgnore: [],
                priority: null,
                instructor: null,
            };

            let result = classList.selectedClasses[transactionID];
            chaiExpect(result).deep.include(expected);
        });

        it("Can choose to make no edit and be fine", () => {
            store.dispatch(setDepartments(["CSE", "DSC"]));
            store.dispatch(setCourseNums(["11", "12"]));
            store.dispatch(setDepartment("CSE"));
            store.dispatch(setCourseNum("12"));

            let inputHandler = getInputHandler(store);
            let transactionID = store.getState().ClassInput.transactionID;
            inputHandler.handleAdd();

            store.dispatch(enterEditMode(transactionID));
            inputHandler.handleEdit();

            let classList = store.getState().ClassList;
            chaiExpect(Object.keys(classList.selectedClasses)).to.have.lengthOf(1);
            chaiExpect(classList.selectedClasses[transactionID].classTitle).to.equal("CSE 12");
        });

        test('Can edit a more complex class with instructor and conflicts fields and so on correctly', async () => {
            // need shallow here because ClassInput has a componentDidMount method causing what I believe to be a
            // race condition between updating in this test thread and updating in the componentDidMount thread,
            // giving wrong results - should not occur in production however

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

            // making first class
            store.dispatch(setDepartments(["CSE", "DSC"]));
            store.dispatch(setCourseNums(["11", "12"]));
            store.dispatch(setInstructors(["Rick Ord", "Joseph Politz"]));

            store.dispatch(setDepartment("CSE"));
            store.dispatch(setCourseNum("11"));
            store.dispatch(setClassTypesToIgnore(["LE", "LA", "DI"]));
            store.dispatch(setInstructor("Rick Ord"));

            let inputHandler = getInputHandler(store);
            let transactionID = store.getState().ClassInput.transactionID;
            inputHandler.handleAdd();

            await store.dispatch(enterEditMode(transactionID));

            // need to reset this after entering edit mode
            store.dispatch(setDepartments(["CSE", "DSC"]));
            store.dispatch(setCourseNums(["11", "12"]));

            // making edits
            inputHandler.onCourseNumChange("12");

            store.dispatch(setInstructors(["Rick Ord", "Joseph Politz"]));
            inputHandler.onInstructorChange("Joseph Politz");

            // adding again
            inputHandler.handleEdit();

            let classList = store.getState().ClassList;
            chaiExpect(Object.keys(classList.selectedClasses)).to.have.lengthOf(1);

            const expected = {
                classTitle: "CSE 12",
                department: "CSE",
                courseNum: "12",
                classTypesToIgnore: [],
                priority: null,
                instructor: "Joseph Politz",
            };

            let result = classList.selectedClasses[transactionID];
            chaiExpect(result).deep.include(expected);
        });

        test('Instructors options change correctly after editing a class and trying to edit other classes', async () => {
            let prev = DataFetcher.fetchClassSummaryFor;

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
            // making first class
            store.dispatch(setDepartments(["CSE", "DSC"]));
            store.dispatch(setCourseNums(["11", "12"]));
            store.dispatch(setInstructors(["Rick Ord", "Joseph Politz"]));
            store.dispatch(populateDataPerClass({"11": ["Joseph Politz", "Rick Ord"], "12": ["Joseph Politz"]},
                {}, {}));

            let inputHandler = getInputHandler(store);
            await inputHandler.onDepartmentChange("CSE");
            inputHandler.onCourseNumChange("11");
            inputHandler.onClassTypesToIgnoreChange(["LE", "LA", "DI"]);
            inputHandler.onInstructorChange("Rick Ord");

            let transactionID = store.getState().ClassInput.transactionID;
            inputHandler.handleAdd();

            await inputHandler.onDepartmentChange("CSE");
            inputHandler.onCourseNumChange("12");

            inputHandler.handleAdd();

            await store.dispatch(enterEditMode(transactionID));

            const state = store.getState().ClassInput;
            chaiExpect(state.instructors).to.have.members(["Joseph Politz", "Rick Ord"]);

            DataFetcher.fetchClassSummaryFor = prev;
        });

        test('Verifies that a class is valid before allowing edit', () => {
            // making first class
            store.dispatch(setDepartments(["CSE"]));
            store.dispatch(setCourseNums(["11", "12"]));
            store.dispatch(setDepartment("CSE"));
            store.dispatch(setCourseNum("11"));

            let transactionID = store.getState().ClassInput.transactionID;

            // adding first class
            let inputHandler = getInputHandler(store);
            inputHandler.handleAdd();

            store.dispatch(enterEditMode(transactionID));
            store.dispatch(setCourseNum("Blank value"));

            inputHandler.handleEdit();

            let classList = store.getState().ClassList;
            chaiExpect(Object.keys(classList.selectedClasses)).to.have.lengthOf(1);
            chaiExpect(classList.selectedClasses[transactionID].courseNum).to.equal("11");
        });

        test('Verifies that a class is is not a duplicate before allowing edit', async () => {
            store.dispatch(setDepartments(["CSE"]));
            store.dispatch(setCourseNums(["11", "12"]));

            // making first class
            let inputHandler = getInputHandler(store);
            await inputHandler.onDepartmentChange("CSE");
            inputHandler.onCourseNumChange("11");
            let id1 = store.getState().ClassInput.transactionID;
            inputHandler.handleAdd();

            // making second class
            store.dispatch(setDepartment("CSE"));
            store.dispatch(setCourseNum("12"));
            let id2 = store.getState().ClassInput.transactionID;
            inputHandler.handleAdd();

            await store.dispatch(enterEditMode(id1));
            store.dispatch(setCourseNum("12"));
            inputHandler.handleEdit();

            let classList = store.getState().ClassList;
            chaiExpect(Object.keys(classList.selectedClasses)).to.have.lengthOf(2);
            chaiExpect(classList.selectedClasses[id1].courseNum).to.equal("11");
            chaiExpect(classList.selectedClasses[id2].courseNum).to.equal("12");
        });

        test("When changing between classes multiple times, gets the correct data", async () => {
            store.dispatch(setDepartments(["CSE"]));
            store.dispatch(setCourseNums(["11", "12"]));
            store.dispatch(setTypes(["LE", "DI"]));

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

            // making first class
            let inputHandler = getInputHandler(store);
            store.dispatch(setDepartment("CSE"));
            store.dispatch(setCourseNum("11"));
            let id1 = store.getState().ClassInput.transactionID;
            inputHandler.handleAdd();

            // making second class
            store.dispatch(setDepartment("CSE"));
            store.dispatch(setCourseNum("12"));
            let id2 = store.getState().ClassInput.transactionID;
            inputHandler.handleAdd();

            await store.dispatch(enterEditMode(id2));
            let state = store.getState().ClassInput;
            chaiExpect(state.types).to.have.lengthOf(1);

            await store.dispatch(enterEditMode(id1));
            state = store.getState().ClassInput;
            console.log(state);
            chaiExpect(state.types).to.have.lengthOf(2);

            await store.dispatch(enterEditMode(id2));
            state = store.getState().ClassInput;
            console.log(state);
            chaiExpect(state.types).to.have.lengthOf(1);
        })
    });

    test("After removing the only class, current schedule is empty list", async () => {
        store.dispatch(setDepartments(["CSE"]));
        store.dispatch(setCourseNums(["11", "12"]));

        // making first class
        let inputHandler = getInputHandler(store);
        await inputHandler.onDepartmentChange("CSE");
        inputHandler.onCourseNumChange("11");
        let id1 = store.getState().ClassInput.transactionID;
        inputHandler.handleAdd();

        await store.dispatch(enterEditMode(id1));
        inputHandler.handleemove();

        const currentSchedule = store.getState().Schedule.currentSchedule;
        chaiExpect(currentSchedule).to.have.lengthOf(0);
    });
});
