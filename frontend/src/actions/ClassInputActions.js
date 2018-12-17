import {DataFetcher} from "../utils/DataFetcher";
import {
    setConflicts,
    setCourseNum,
    setCourseNums, setDepartment,
    setDepartments, setEditMode,
    setInstructor,
    setPriority
} from "./ClassInputMutator";
import {setProgress} from "./ScheduleGenerationActions";

export const ADD_CLASS = "ADD_CLASS";
export const EDIT_CLASS = "EDIT_CLASS";
export const REMOVE_CLASS = "REMOVE_CLASS";

export const POPULATE_DATA_PER_CLASS = "POPULATE_DATA_PER_CLASS";

export function removeClass(uid) {
    return {
        type: REMOVE_CLASS,
        uid: uid
    }
}

export function addClass(uuid, newClass) {
    return {
        type: ADD_CLASS,
        payload: {
            uuid: uuid,
            add: newClass
        }
    }
}

export function editClass(uid, editClass) {
    return {
        type: EDIT_CLASS,
        editClass: editClass,
        editUID: uid
    }
}

export function initDepartments() {
    return async function (dispatch) {
        let departments = await DataFetcher.fetchDepartments();
        console.log(departments);
        dispatch(setDepartments(departments));
    }
}

export function enterEditMode(uid) {
    return function (dispatch, getState) {
        const otherClass = getState().ClassSelection[uid];

        dispatch(populateSectionData(otherClass.department));

        dispatch(setPriority(otherClass.priority));
        dispatch(setConflicts(otherClass.conflicts));
        dispatch(setDepartment(otherClass.department));
        dispatch(setInstructor(otherClass.instructor));
        dispatch(setCourseNum(otherClass.courseNum));
        dispatch(setEditMode(uid, true));
    }
}

export function enterInputMode() {
    return function (dispatch) {
        dispatch(setProgress(0));

        dispatch(setPriority(null));
        dispatch(setConflicts(null));
        dispatch(setInstructor(null));
        dispatch(setCourseNum(null));
        dispatch(setDepartment(null));
        dispatch(setEditMode(null, false));
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
