import {
    setConflicts,
    setCourseNum, setDepartment, setEditOccurred,
    setInstructor, setInstructors,
    setPriority, setTypes
} from "./ClassInputMutator";
import {addClass, editClass, enterInputMode, populateSectionData, removeClass} from "./ClassInputActions";
import {setUID} from "../ScheduleGenerationActions";
import {setInstructorPref, setPriorityPref} from "../SchedulePreference/SchedulePreferenceHandler";

/**
 * Is responsible for handling all ClassInput actions, which includes running business logic when changing fields to adding
 * and removing classes
 */
export class ClassInputHandler {
    constructor(dispatch, getState) {
        this.dispatch = dispatch;
        this.getState = getState;
    }

    /**
     * Edits the department and runs business rule validation on it
     */
    onDepartmentChange(rawDepartment) {
        if(!rawDepartment)
            return;

        const state = this.getState().ClassInput;

        let department = rawDepartment.trim();
        // sets the department in the store
        this.dispatch(setDepartment(department));

        // don't alter anything if the department isn't even valid
        if(!state.departments.includes(department))
            return;

        // no reason to change if the two are the same
        if(state.department === department)
            return;

        // set all other fields to blank
        this.dispatch(setCourseNum(null));
        this.dispatch(setInstructor(null));
        // will autoconvert to empty list
        this.dispatch(setConflicts(null));
        this.dispatch(setPriority(null));

        // populate the course nums and the data
        this.dispatch(populateSectionData(department));

        if (state.editMode)
            this.dispatch(setEditOccurred(true));
    }

    onCourseNumChange(rawCourseNum) {
        if(!rawCourseNum)
            return;

        const state = this.getState().ClassInput;
        let courseNum = rawCourseNum.trim();
        this.dispatch(setCourseNum(courseNum));

        if(courseNum === state.courseNum)
            return;

        // must clear out the fields
        this.dispatch(setInstructor(null));
        this.dispatch(setPriority(null));
        this.dispatch(setConflicts(null));

        // record the edit
        if (state.editMode)
            this.dispatch(setEditOccurred(true));

        console.log(state);

        const instructors = state.instructorsPerClass[courseNum];
        if (!instructors)
            console.warn(`Instructors are undefined for course num ${courseNum}`);

        const types = state.classTypesPerClass[courseNum];
        if (!types)
            console.warn(`Class Types are undefined for course num ${courseNum}`);

        this.dispatch(setTypes(types));
        this.dispatch(setInstructors(instructors));
    }

    onInstructorChange(rawInstructor) {
        if(!rawInstructor)
            return;

        const state = this.getState().ClassInput;
        let instructor = rawInstructor.trim();

        console.log(state.editMode);
        // record the edit
        if (state.editMode)
            this.dispatch(setEditOccurred(true));

        this.dispatch(setPriority(null));
        this.dispatch(setConflicts(null));
        this.dispatch(setInstructor(instructor));
    }

    onConflictChange(conflicts) {
        if(!conflicts)
            return;

        const state = this.getState().ClassInput;
        // record the edit
        if (state.editMode)
            this.dispatch(setEditOccurred(true));

        this.dispatch(setConflicts(conflicts));
    }

    onPriorityChange(priority) {
        if(!priority)
            return;

        const state = this.getState().ClassInput;
        // record the edit
        if (state.editMode)
            this.dispatch(setEditOccurred(true));

        this.dispatch(setPriority(priority));
    }

    buildClassFromInput() {
        const state = this.getState().ClassInput;
        // should refactor this into ClassSkeleton
        let newClass = {};
        newClass['classTitle'] = `${state.department} ${state.courseNum}`;
        newClass['courseNum'] = state.courseNum;
        newClass['department'] = state.department;
        newClass['instructor'] = state.instructor;
        newClass['priority'] = state.priority;
        newClass['conflicts'] = state.conflicts;

        return newClass;
    }

    autosave() {
        const state = this.getState().ClassInput;
        if (state.editMode && state.editOccurred) {
            // just save everything
            let newClass = this.buildClassFromInput();

            console.log(state);
            console.log(newClass);
            this.dispatch(setEditOccurred(false));
            this.dispatch(editClass(state.id, newClass));
        }
    }

    handleEdit() {
        this.autosave();
        this.dispatch(enterInputMode());
    }

    handleRemove() {
        const state = this.getState().ClassInput;
        // show an error message saying what class was dropped if that class
        // is a valid one
        if (state.departments.includes(state.department) &&
            state.courseNums.includes(state.courseNum)) {
            state.messageHandler.showSuccess(`Removed class ${state.department} 
                                    ${state.courseNum}`, 1000);
        } else {
            state.messageHandler.showSuccess("Successfully removed class", 1000);
        }

        this.dispatch(removeClass(state.id));
        this.dispatch(enterInputMode());
    }

    isDuplicate(newClass) {
        // testing whether this is a duplicate class
        return Object.values(this.getState().ClassList.selectedClasses).reduce(function (accumulator, previousClass) {
            return accumulator || newClass.classTitle === previousClass['classTitle']
        }, false);
    }

    handleAdd() {
        const state = this.getState().ClassInput;
        // gotta have course num and department to do anything
        // checking for both null and undefined
        if (!state.courseNum || !state.department)
            return;

        let error = false;
        let newClass = this.buildClassFromInput();

        if (this.isDuplicate(newClass)) {
            state.messageHandler.showError(`Class ${state.department} ${state.courseNum} has already been added!`);
            return;
        }

        // error checking on department and course num
        if (!state.departments.includes(state.department))
            error = true;
        if (!state.courseNums.includes(state.courseNum))
            error = true;

        if (error) {
            state.messageHandler.showError(`Failed to add class ${state.department} ${state.courseNum}`, 1000);
            return;
        }

        const classTitle = `${state.department} ${state.courseNum}`;
        const instructor = state.instructor;
        const priority = state.priority;

        // using the addClass method from the reducer
        this.dispatch(addClass(newClass));

        // adding preferences
        this.dispatch(setInstructorPref(classTitle, instructor));
        this.dispatch(setPriorityPref(classTitle, priority));

        this.dispatch(setInstructor(null));
        this.dispatch(setCourseNum(null));
        this.dispatch(setPriority(null));
        this.dispatch(setConflicts(null));

        this.dispatch(setUID(null));
    }
}

export function getInputHandler(dispatch = null, getState = null) {
    // overloading so can be used by redux and outside of redux as well
    if(dispatch && getState)
        return new ClassInputHandler(dispatch, getState);

    return function (dispatch, getState) {
        return new ClassInputHandler(dispatch, getState);
    }
}