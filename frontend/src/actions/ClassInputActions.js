import {DataFetcher} from "../utils/DataFetcher";
import {
    setConflicts,
    setCourseNum,
    setCourseNums, setDepartment,
    setDepartments, setEditMode, setID,
    setInstructor,
    setPriority
} from "./ClassInputMutator";
import {setProgress} from "./ScheduleGenerationActions";

export const ADD_CLASS = "ADD_CLASS";
export const EDIT_CLASS = "EDIT_CLASS";
export const REMOVE_CLASS = "REMOVE_CLASS";

export const POPULATE_DATA_PER_CLASS = "POPULATE_DATA_PER_CLASS";

export function removeClass(id) {
    return {
        type: REMOVE_CLASS,
        id: id
    }
}

export function addClass(newClass) {
    return {
        type: ADD_CLASS,
        newClass: newClass
    }
}

export function editClass(id, editClass) {
    return {
        type: EDIT_CLASS,
        id: id,
        editClass: editClass,
    }
}

export function initDepartments() {
    return async function (dispatch) {
        let departments = await DataFetcher.fetchDepartments();
        console.log(departments);
        dispatch(setDepartments(departments));
    }
}

export function enterEditMode(id) {
    return function (dispatch, getState) {
        const otherClass = getState().ClassList.selectedClasses[id];

        dispatch(populateSectionData(otherClass.department));

        dispatch(setPriority(otherClass.priority));
        dispatch(setConflicts(otherClass.conflicts));
        dispatch(setDepartment(otherClass.department));
        dispatch(setInstructor(otherClass.instructor));
        dispatch(setCourseNum(otherClass.courseNum));

        dispatch(setEditMode(true));
        // setting current class id
        dispatch(setID(id));
    }
}

export function enterInputMode() {
    return function (dispatch, getState) {
        dispatch(setProgress(0));

        dispatch(setPriority(null));
        dispatch(setConflicts(null));
        dispatch(setInstructor(null));
        dispatch(setCourseNum(null));
        dispatch(setDepartment(null));

        dispatch(setEditMode(false));
        // just put it to one more than what it was before
        dispatch(setID(getState().ClassList.selectedClasses.length + 1));
    }
}

export function populateSectionData(department) {
    return async function (dispatch) {
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
