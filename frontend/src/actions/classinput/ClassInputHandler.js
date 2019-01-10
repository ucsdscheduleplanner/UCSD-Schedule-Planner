import {
    setClassTypesToIgnore,
    setCourseNum, setCourseNums,
    setDepartment,
    setEditOccurred,
    setTransactionID,
    setInstructor,
    setInstructors,
    setPriority,
    setTypes
} from "./ClassInputMutator";
import {addClass, editClass, enterInputMode, populateSectionData, removeClass} from "./ClassInputActions";
import {SchedulePreferenceInputHandler} from "../schedulepreference/SchedulePreferenceInputHandler";
import {ignoreClassTypes} from "../ignoreclasstypes/IgnoreClassTypesActions";

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
    onDepartmentChange(rawDepartment, triggers = true) {
        if (!rawDepartment) {
            this.dispatch(setDepartment(null));
            return;
        }

        const state = this.getState().ClassInput;

        let department = rawDepartment.trim();

        // sets the department in the store
        this.dispatch(setDepartment(department));

        if (!triggers)
            return;

        // don't alter anything if the department isn't even valid
        if (!state.departments.includes(department))
            return;

        // set all other fields to blank
        this.dispatch(setCourseNum(null));
        this.dispatch(setInstructor(null));
        // will autoconvert to empty list
        this.dispatch(setClassTypesToIgnore(null));
        this.dispatch(setPriority(null));

        if (state.editMode)
            this.autosave(true);
        // populate the course nums and the data
        return this.dispatch(populateSectionData(department));
    }


    onCourseNumChange(rawCourseNum, triggers = true) {
        if (!rawCourseNum) {
            this.dispatch(setCourseNum(null));
            return;
        }

        const state = this.getState().ClassInput;
        let courseNum = rawCourseNum.trim();
        this.dispatch(setCourseNum(courseNum));

        if (!triggers)
            return;

        if (!state.courseNums.includes(courseNum))// && state.courseNums.length > 0)
            return;

        // must clear out the fields
        this.dispatch(setInstructor(null));
        this.dispatch(setPriority(null));
        this.dispatch(setClassTypesToIgnore(null));

        const instructors = state.instructorsPerClass[courseNum];
        if (!instructors)
            console.warn(`Instructors are undefined for course num ${courseNum}`);

        const types = state.classTypesPerClass[courseNum];
        if (!types)
            console.warn(`Class Types are undefined for course num ${courseNum}`);

        this.dispatch(setTypes(types));
        this.dispatch(setInstructors(instructors));

        // autosave after everything else has been set
        if (state.editMode)
            this.autosave(true);
    }

    onInstructorChange(rawInstructor) {
        if (!rawInstructor) {
            this.dispatch(setInstructor(null));
            return;
        }

        const state = this.getState().ClassInput;
        console.log(state);
        let instructor = rawInstructor.trim();
        this.dispatch(setInstructor(instructor));

        if (!state.instructors.includes(instructor))
            return;

        // only record valid edits
        if (state.editMode)
            this.autosave(true);

        this.dispatch(setPriority(null));
        this.dispatch(setClassTypesToIgnore(null));
    }

    onClassTypesToIgnoreChange(classTypesToIgnore) {
        if (!classTypesToIgnore) {
            this.dispatch(setClassTypesToIgnore(null));
            return;
        }

        this.dispatch(setClassTypesToIgnore(classTypesToIgnore));
        const state = this.getState().ClassInput;
        // record the edit
        if (state.editMode)
            this.autosave(true);
    }

    onPriorityChange(priority) {
        // if (!priority) {
        //     this.dispatch(setPriority(null));
        //     return;
        // }
        //
        // this.dispatch(setPriority(priority));
        // const state = this.getState().ClassInput;
        // // record the edit
        // if (state.editMode)
        //     this.autosave(true);
    }

    buildClassFromInput() {
        const state = this.getState().ClassInput;
        // should refactor this into ClassSkeleton
        return Object.assign({},
            {
                classTitle: `${state.department} ${state.courseNum}`,
                courseNum: state.courseNum,
                department: state.department,
                instructor: state.instructor,
                priority: state.priority,
                classTypesToIgnore: state.classTypesToIgnore,

                instructors: state.instructors,
                types: state.types
            }
        );
    }

    isValidAdd(newClass) {
        const state = this.getState().ClassInput;
        if (this.isDuplicate(newClass))
            return {
                valid: false,
                reason: `Class ${state.department} ${state.courseNum} has already been added!`
            };
        return this.isValid(newClass);
    }

    isValidEdit(newClass) {
        const state = this.getState().ClassInput;
        if (this.isDuplicate(newClass, state.transactionID)) {
            return {
                valid: false,
                reason: `Class ${state.department} ${state.courseNum} has already been added!`
            };
        }

        return this.isValid(newClass);
    }

    /**
     * Returns whether a class is valid or not as long as the reason it is not if so
     * @param newClass the class to check
     * @returns {valid, reason}
     */
    isValid(newClass) {
        const state = this.getState().ClassInput;
        if (!state.departments.includes(newClass.department))
            return {
                valid: false,
                reason: "Department is not valid"
            };
        if (!state.courseNums.includes(newClass.courseNum))
            return {
                valid: false,
                reason: "Course Num is not valid"
            };
        if (newClass.instructor && !state.instructors.includes(newClass.instructor))
            return {
                valid: false,
                reason: "Instructor is not valid"
            };
        if (this.isDuplicate(newClass)) {

        }

        return {
            valid: true
        };
    }

    /**
     * Called in editMode such that whenever the user makes an edit, any changes are saved to the store
     */
    autosave(force = false) {
        const state = this.getState().ClassInput;
        if (force || (state.editMode && state.editOccurred)) {
            console.log("autosaving");
            console.log(state);
            // just save everything
            let newClass = this.buildClassFromInput();
            console.log(newClass);

            let {valid, reason} = this.isValidEdit(newClass);
            if (!valid) {
                return `Failed to edit class. Reason: ${reason}`;
            }

            this.dispatch(setEditOccurred(false));
            this.dispatch(editClass(state.transactionID, newClass));
            this.savePreferences();
        }
    }

    handleEdit() {
        const state = this.getState().ClassInput;
        let errMsg = this.autosave(true);
        if (errMsg)
            state.messageHandler.showError(errMsg, 1000);

        this.dispatch(enterInputMode());
    }

    /**
     * Handle what occurs when the remove button is hit during edit mode
     *
     * If the user has edited some of the fields such that the department and courseNum are no longer valid, then just
     * say remove, otherwise if the class was valid then output a message with the department and courseNum
     */
    handleRemove() {
        const state = this.getState().ClassInput;

        if (!state.editMode) {
            console.warn("Somehow, the user was able to trigger class removal without being in edit mode, breaking now.")
            return;
        }

        if (state.departments.includes(state.department) && state.courseNums.includes(state.courseNum))
            state.messageHandler.showSuccess(`Removed class ${state.department} ${state.courseNum}`, 1000);
        else state.messageHandler.showSuccess("Successfully removed class", 1000);

        this.dispatch(removeClass(state.transactionID));
        this.dispatch(enterInputMode());
    }

    /**
     * Checks if a class is already in the store
     * @param newClass the class to check for duplicates
     * @param exclude class id to exclude
     * @returns boolean the store contains the given class already
     */
    isDuplicate(newClass, exclude = "") {
        let state = this.getState().ClassList;

        if (typeof exclude !== "string")
            console.warn(`The given key ${exclude} is of type ${typeof exclude} instead of string, continuing`);

        return Object.keys(state.selectedClasses).reduce(function (accumulator, key) {
            if (exclude === key)
                return accumulator;
            return accumulator || newClass.classTitle === state.selectedClasses[key]['classTitle']
        }, false);
    }

    handleAdd() {
        const state = this.getState().ClassInput;
        // gotta have course num and department to do anything
        // checking for both null and undefined
        if (!state.courseNum || !state.department)
            return;

        let newClass = this.buildClassFromInput();

        let {valid, reason} = this.isValidAdd(newClass);
        if (!valid) {
            state.messageHandler.showError(`Failed to add class. Reason: ${reason}`, 1000);
            return;
        }

        // using the addClass method from the reducer
        this.dispatch(addClass(newClass, state.transactionID));
        this.savePreferences();

        // nulling out the other fields
        this.dispatch(setInstructor(null));
        this.dispatch(setCourseNum(null));
        this.dispatch(setPriority(null));
        this.dispatch(setClassTypesToIgnore(null));

        console.log("adding");
        console.log(state.transactionID);
        this.dispatch(setTransactionID(null));
    }

    clear() {
        this.dispatch(setDepartment(null));
        this.dispatch(setInstructor(null));
        this.dispatch(setCourseNum(null));
        this.dispatch(setPriority(null));
        this.dispatch(setClassTypesToIgnore(null));

        this.dispatch(setCourseNums(null));
        this.dispatch(setInstructors(null));
        this.dispatch(setTypes(null));

        // null out this transaction
        this.dispatch(setTransactionID(null));
    }

    savePreferences() {
        const state = this.getState().ClassInput;

        // TODO this is terrible gotta fix this, why create an object like this?
        let inputHandler = new SchedulePreferenceInputHandler(this.dispatch, this.getState);
        inputHandler.setClassSpecificPref();

        // sending the updates to the reducer for ignoring class types
        const classTitle = `${state.department} ${state.courseNum}`;
        this.dispatch(ignoreClassTypes(classTitle, state.classTypesToIgnore));
    }
}

export function getInputHandler(dispatch = null, getState = null) {
    // overloading so can be used by redux and outside of redux as well
    if (dispatch && getState)
        return new ClassInputHandler(dispatch, getState);

    return function (dispatch, getState) {
        return new ClassInputHandler(dispatch, getState);
    }
}