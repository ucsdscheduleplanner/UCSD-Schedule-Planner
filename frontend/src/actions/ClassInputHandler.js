import {
    setConflicts,
    setCourseNum, setDepartment, setEditOccurred,
    setInstructor, setInstructors,
    setPriority, setTypes
} from "./ClassInputMutator";
import {addClass, editClass, enterInputMode, populateSectionData, removeClass} from "./ClassInputActions";
import {setUID} from "./ScheduleGenerationActions";
import {setInstructorPref, setPriorityPref} from "./SchedulePreferenceHandler";

/**
 * Is responsible for handling all ClassInput actions, which includes running business logic when changing fields to adding
 * and removing classes
 */
export class ClassInputHandler {
    constructor(dispatch, getState) {
        this.dispatch = dispatch;
        this.state = getState().ClassInput;
        this.getState = getState;
    }

    /**
     * Edits the department and runs business rule validation on it
     */
    onDepartmentChange(rawDepartment) {
        let department = rawDepartment.trim();
        // sets the department in the store
        this.dispatch(setDepartment(department));

        // don't alter anything if the department isn't even valid
        if(!this.state.departments.includes(department))
            return;

        // no reason to change if the two are the same
        if(this.state.department === department)
            return;

        // set all other fields to blank
        this.dispatch(setCourseNum(null));
        this.dispatch(setInstructor(null));
        // will autoconvert to empty list
        this.dispatch(setConflicts(null));
        this.dispatch(setPriority(null));

        // populate the course nums and the data
        this.dispatch(populateSectionData(department));

        if (this.state.editMode)
            this.dispatch(setEditOccurred(true));
    }

    onCourseNumChange(rawCourseNum) {
        let courseNum = rawCourseNum.trim();
        this.dispatch(setCourseNum(courseNum));

        if (!this.state.courseNums.includes(courseNum))
            return;

        // must clear out the fields
        this.dispatch(setInstructor(null));
        this.dispatch(setPriority(null));
        this.dispatch(setConflicts(null));

        // record the edit
        if (this.state.editMode)
            this.dispatch(setEditOccurred(true));

        const instructors = this.state.instructorsPerClass[courseNum];
        if (!instructors)
            console.warn(`Instructors are undefined for course num ${courseNum}`);

        const types = this.state.classTypesPerClass[courseNum];
        if (!types)
            console.warn(`Class Types are undefined for course num ${courseNum}`);

        this.dispatch(setTypes(types));
        this.dispatch(setInstructors(instructors));
    }

    onInstructorChange(rawInstructor) {
        let instructor = rawInstructor.trim();

        console.log(this.state.editMode);
        // record the edit
        if (this.state.editMode)
            this.dispatch(setEditOccurred(true));

        this.dispatch(setInstructor(instructor));
    }

    onConflictChange(conflicts) {
        // record the edit
        if (this.state.editMode)
            this.dispatch(setEditOccurred(true));

        this.dispatch(setConflicts(conflicts));
    }

    onPriorityChange(priority) {
        // record the edit
        if (this.state.editMode)
            this.dispatch(setEditOccurred(true));

        this.dispatch(setPriority(priority));
    }

    buildClassFromInput() {
        // should refactor this into ClassSkeleton
        let newClass = {};
        newClass['classTitle'] = `${this.state.department} ${this.state.courseNum}`;
        newClass['courseNum'] = this.state.courseNum;
        newClass['department'] = this.state.department;
        newClass['instructor'] = this.state.instructor;
        newClass['conflicts'] = this.state.conflicts;

        return newClass;
    }

    autosave() {
        if (this.state.editMode && this.state.editOccurred) {
            // just save everything
            let newClass = this.buildClassFromInput();

            console.log(this.state);
            console.log(newClass);
            this.dispatch(setEditOccurred(false));
            this.dispatch(editClass(this.state.id, newClass));
        }
    }

    handleEdit() {
        this.autosave();
        this.dispatch(enterInputMode());
    }

    handleRemove() {
        // show an error message saying what class was dropped if that class
        // is a valid one
        if (this.state.departments.includes(this.state.currentDepartment) &&
            this.state.courseNums.includes(this.state.currentCourseNum)) {
            this.state.messageHandler.showSuccess(`Removed class ${this.state.currentDepartment} 
                                    ${this.state.currentCourseNum}`, 1000);
        } else {
            console.log("removing here");
            this.dispatch(removeClass(this.state.id));
            this.state.messageHandler.showSuccess("Successfully removed class", 1000);
        }

        this.dispatch(enterInputMode());
    }

    isDuplicate(newClass) {
        // testing whether this is a duplicate class
        return Object.values(this.getState().ClassList.selectedClasses).reduce(function (accumulator, previousClass) {
            return accumulator || newClass.classTitle === previousClass['classTitle']
        }, false);
    }

    handleAdd() {
        // gotta have course num and department to do anything
        // checking for both null and undefined
        if (!this.state.courseNum || !this.state.department)
            return;

        let error = false;
        let newClass = this.buildClassFromInput();

        if (this.isDuplicate(newClass)) {
            this.state.messageHandler.showError(`Class ${this.state.currentDepartment} ${this.state.currentCourseNum} has already been added!`);
            return;
        }

        // error checking on department and course num
        if (!this.state.departments.includes(this.state.department))
            error = true;
        if (!this.state.courseNums.includes(this.state.courseNum))
            error = true;

        if (error) {
            this.state.messageHandler.showError(`Failed to add class ${this.state.department} ${this.state.courseNum}`, 1000);
            return;
        }

        const classTitle = `${this.state.department} ${this.state.courseNum}`;
        const instructor = this.state.instructor;
        const priority = this.state.priority;

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

export function getInputHandler() {
    return function (dispatch, getState) {
        return new ClassInputHandler(dispatch, getState);
    }
}