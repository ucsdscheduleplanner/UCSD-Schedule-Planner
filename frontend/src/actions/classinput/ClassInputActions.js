import {DataFetcher} from "../../utils/DataFetcher";
import {
    setClassTypesToIgnore,
    setCourseNum,
    setCourseNums, setDepartment,
    setDepartments, setEditMode, setTransactionID,
    setInstructor,
    setPriority, setInstructors, setTypes
} from "./ClassInputMutator";
import {setProgress} from "../schedule/generation/ScheduleGenerationActions";
import {getInputHandler} from "./ClassInputHandler";

export const ADD_CLASS = "ADD_CLASS";
export const EDIT_CLASS = "EDIT_CLASS";
export const REMOVE_CLASS = "REMOVE_CLASS";

export const POPULATE_DATA_PER_CLASS = "POPULATE_DATA_PER_CLASS";

export function removeClass(transactionID) {
    return {
        type: REMOVE_CLASS,
        transactionID: transactionID
    }
}

export function addClass(newClass, transactionID) {
    return {
        type: ADD_CLASS,
        newClass: newClass,
        transactionID: transactionID
    }
}

export function editClass(transactionID, editClass) {
    return {
        type: EDIT_CLASS,
        transactionID: transactionID,
        editClass: editClass,
    }
}

export function initDepartments() {
    return async function (dispatch) {
        let departments = await DataFetcher.fetchDepartments();
        dispatch(setDepartments(departments));
    }
}

export function toggleEditMode(transactionID) {
    return async function (dispatch, getState) {
        const prevTransactionID = getState().ClassInput.transactionID;

        // nothing changed, so should close it
        if(prevTransactionID === transactionID) {
            dispatch(setTransactionID(null));
            dispatch(enterInputMode());
        } else
            await dispatch(enterEditMode(transactionID));
    }
}

export function enterEditMode(id) {
    return async function (dispatch, getState) {
        const otherClass = getState().ClassList.selectedClasses[id];

        let inputHandler = getInputHandler(dispatch, getState);

        await inputHandler.onDepartmentChange(otherClass.department);
        inputHandler.onCourseNumChange(otherClass.courseNum);
        inputHandler.onInstructorChange(otherClass.instructor);
        inputHandler.onClassTypesToIgnoreChange(otherClass.classTypesToIgnore);
        inputHandler.onPriorityChange(otherClass.priority);

        dispatch(setEditMode(true));
        // setting current class id
        dispatch(setTransactionID(id));
    }
}

export function enterInputMode() {
    return function (dispatch, getState) {
        dispatch(setProgress(0));

        dispatch(setPriority(null));
        dispatch(setClassTypesToIgnore(null));
        dispatch(setInstructor(null));
        dispatch(setCourseNum(null));
        dispatch(setDepartment(null));

        dispatch(setInstructors(null));
        dispatch(setTypes(null));
        dispatch(setCourseNums(null));

        dispatch(setEditMode(false));

        // make a new transaction id
        dispatch(setTransactionID(null));
    }
}

export function populateSectionData(department) {
    return async function (dispatch) {
        console.log("Populating data for " + department);
        let {courseNums, instructorsPerClass, classTypesPerClass, descriptionsPerClass} =
            await DataFetcher.fetchClassSummaryFor(department);

        dispatch(setCourseNums(courseNums));
        dispatch(populateDataPerClass(instructorsPerClass, descriptionsPerClass, classTypesPerClass));
    }
}


export function populateDataPerClass(instructorsPerClass, descriptionsPerClass, classTypesPerClass) {
    return {
        type: POPULATE_DATA_PER_CLASS,
        instructorsPerClass: instructorsPerClass,
        descriptionsPerClass: descriptionsPerClass,
        classTypesPerClass: classTypesPerClass
    }
}
