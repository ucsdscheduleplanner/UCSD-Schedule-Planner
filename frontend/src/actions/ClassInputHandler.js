import {
    setConflicts,
    setCourseNum, setDepartment, setEditOccurred,
    setInstructor, setInstructors,
    setPriority, setTypes
} from "./ClassInputMutator";
import {addClass, editClass, populateSectionData, removeClass} from "./ClassInputActions";
import {setUID} from "./ScheduleGenerationActions";

class InputHandler {
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

        if(!this.state.departments.includes(department))
            return;

        // set all other fields to blank
        this.dispatch(setCourseNum(null));
        this.dispatch(setInstructor(null));
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
        console.log(rawInstructor);
        let instructor = rawInstructor.trim();

        this.dispatch(setPriority(null));
        this.dispatch(setConflicts(null));

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
        return newClass;
    }

    handleEdit() {
        if (this.state.editMode && this.state.editOccurred) {
            this.dispatch(setEditOccurred(true));

            // just save everything
            let newClass = this.buildClassFromInput();
            this.dispatch(editClass(this.state.editUID, newClass));
        }
    }

    handleRemove() {
        // show an error message saying what class was dropped if that class
        // is a valid one
        if (this.state.departments.includes(this.state.currentDepartment) &&
            this.state.courseNums.includes(this.state.currentCourseNum)) {
            this.state.messageHandler.showSuccess(`Removed class ${this.state.currentDepartment} 
                                    ${this.state.currentCourseNum}`, 1000);
        } else {
            this.dispatch(removeClass(this.state.editUID));
            this.state.messageHandler.showSuccess("Successfully removed class", 1000);
        }

        this.state.enterInputMode();
    }

    isDuplicate(newClass) {
        // testing whether this is a duplicate class
        return Object.values(this.getState().ClassSelection).reduce(function (accumulator, previousClass) {
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

        // using the addClass method from the reducer
        this.dispatch(addClass(this.state.uid, newClass));
        // TODO do this
        //this.dispatch(savePreferences());

        this.dispatch(setInstructor(null));
        this.dispatch(setCourseNum(null));
        this.dispatch(setPriority(null));
        this.dispatch(setConflicts(null));

        this.dispatch(setUID(this.state.uid + 1));
    }
}

export function getInputHandler() {
    return function (dispatch, getState) {
        return new InputHandler(dispatch, getState);
    }
}