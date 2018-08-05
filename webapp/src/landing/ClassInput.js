import React, {PureComponent} from 'react';
import {Rating} from "primereact/components/rating/Rating";
import {ListBox} from "primereact/components/listbox/ListBox";
import {Button} from "primereact/components/button/Button";
import {AutoComplete} from "primereact/components/autocomplete/AutoComplete";
import "../css/ClassInput.css";


export default class ClassInput extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            duplicate: false,

            editOccurred: false,
            instructorOptions: [],
            departmentOptions: [],
            classOptions: [],
        };
    }

    clearFields(fields) {
        let clearObj = fields.reduce((accumulator, field) => {
            accumulator[field] = null;
            return accumulator;
        }, {});
        this.setState(clearObj);
    }

    completeDepartmentSuggestions(event) {
        let departmentOptions = this.props.departments.filter((department) => {
            return department.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({departmentOptions: departmentOptions});
    }

    completeClassSuggestions(event) {
        // hopefully this will never trigger
        if (this.props.courseNums.length === 0) return;

        // hits the caching layer here
        let classOptions = this.props.courseNums.filter((Class) => {
            if (Class) return Class.toLowerCase().startsWith(event.query.toLowerCase());
            return false;
        });
        this.setState({classOptions: classOptions});
    }

    completeInstructorSuggestions(event) {
        if (this.props.instructorsPerClass && this.props.instructorsPerClass[this.props.currentCourseNum]) {
            // hits the caching layer here
            let instructorOptions = this.props.instructorsPerClass[this.props.currentCourseNum]
                .filter((instructor) => {
                    if (instructor) return instructor.toLowerCase().startsWith(event.query.toLowerCase());
                    return false;
                });
            this.setState({instructorOptions: instructorOptions});
        } else {
            this.setState({instructorOptions: []});
        }
    }

    getClassTypeOptions(courseNum) {
        if (this.props.classTypesPerClass && this.props.classTypesPerClass[courseNum]) {
            // filtering midterms and finals for now
            // TODO find way to mess with labels and values to make this cleaner and less shaky
            return this.props.classTypesPerClass[courseNum].filter((classType) => {
                return classType["label"] !== "Final Exam" && classType["label"] !== "Midterm";
            });
        }
        // need to return undefined for UI instead of null
        return [{label: 'None'}];
    }

    createClassFromInput() {
        let newClass = {};
        newClass['classTitle'] = `${this.props.currentDepartment} ${this.props.currentCourseNum}`;
        newClass['courseNum'] = this.props.currentCourseNum;
        newClass['department'] = this.props.currentDepartment;
        newClass['priority'] = this.props.priority;
        newClass['conflicts'] = this.props.conflicts;
        newClass['instructor'] = this.props.currentInstructor;
        return newClass;
    }

    handleSubmit() {
        let error = false;
        // gotta have course num and department to do anything
        if (this.props.currentCourseNum === null || this.props.currentDepartment === null) return;

        let classTitle = `${this.props.currentDepartment} ${this.props.currentCourseNum}`;

        // testing whether this is a duplicate class
        let duplicate = Object.values(this.props.selectedClasses).reduce(function (accumulator, previousClass) {
            return accumulator || classTitle === previousClass['classTitle']
        }, false);

        // error checking on department and course num
        if (!this.props.departments.includes(this.props.currentDepartment)) error = true;
        if (!this.props.courseNums.includes(this.props.currentCourseNum)) error = true;

        if (!duplicate && !error) {
            // constructing new class to be added to UI
            let newClass = this.createClassFromInput();

            // using the addClass method from the reducer
            this.props.addClass(this.props.uid, newClass);

            // do cleanup
            this.props.setCurrentInstructor(null);
            this.props.setCurrentCourseNum(null);
            this.props.setPriority(null);
            this.props.setConflicts(null);
        } else if (duplicate) {
            this.props.messageHandler.showError(`Class ${this.props.currentDepartment} ${this.props.currentCourseNum}
            has already been added!`);
        } else {
            this.props.messageHandler.showError(`Failed to add class ${this.props.currentDepartment} ${this.props.currentCourseNum}`, 1000);
        }

        this.props.setUID(this.props.uid + 1);
        // set duplicate so we can do some UI stuff in case
        this.setState({
            duplicate: duplicate
        });
    }

    // basically same function as handle submit
    handleEdit() {
        if (this.props.currentCourseNum === null || this.props.currentDepartment === null) return;
        let classTitle = `${this.props.currentDepartment} ${this.props.currentCourseNum}`;
        // testing whether this is a duplicate class
        // handle edit means it must have a uid
        let that = this;
        let duplicate = Object.values(this.props.selectedClasses).reduce(function (accumulator, previousClass) {
            return (that.props.selectedClasses[that.props.editUID] !== previousClass) &&
                (accumulator || classTitle === previousClass['classTitle'])
        }, false);

        if (!duplicate) {
            // constructing new class to be added to UI
            let newClass = this.createClassFromInput();
            // using the edit method from the reducer
            this.props.editClass(this.props.editUID, newClass);
        }
    }

    handleRemove() {
        this.props.removeClass(this.props.editUID);

        if (this.props.departments.includes(this.props.currentDepartment) &&
            this.props.courseNums.includes(this.props.currentCourseNum)) {
            this.props.messageHandler.showSuccess(`Removed class ${this.props.currentDepartment} 
                                    ${this.props.currentCourseNum}`, 1000);
        } else {
            this.props.messageHandler.showSuccess("Successfully removed class", 1000);
        }

        this.props.enterInputMode();
    }

    render() {
        let deleteButton = (
            <div className="form-button">
                <Button label="Delete Class" className="ui-button-danger" style={{padding: ".25em 1em"}}
                        disabled={this.props.currentCourseNum === null}
                        onClick={this.handleRemove.bind(this)}
                />
            </div>
        );

        let addButton = (
            <div className="form-button" onClick={this.handleSubmit.bind(this)}>
                <Button label="Add Class" style={{padding: ".25em 1em"}}
                        disabled={this.props.currentCourseNum === null}
                />
            </div>
        );

        if (this.props.editMode && this.state.editOccurred) {
            this.setState({editOccurred: false});
            this.handleEdit();
        }

        return (
            <React.Fragment>
                <div className="content">
                    <div className="form-field">
                        <div className="input-header"> Department:</div>
                        <AutoComplete id="department"
                                      suggestions={this.state.departmentOptions}
                                      dropdown={true}
                                      value={this.props.currentDepartment}
                                      onChange={(e) => {
                                          this.props.setCurrentDepartment(e.value.toUpperCase());
                                          this.props.setCurrentCourseNum(null);
                                          this.props.setCurrentInstructor(null);
                                          this.props.setPriority(null);

                                          if (!this.props.departments.includes(e.value.toUpperCase())) {
                                              return;
                                          }

                                          this.props.setClassSummaryFromDepartment(e.value);

                                          // check if the thing we selected is the same as the one we already had
                                          if (e.value !== this.props.currentDepartment) {
                                              this.props.setCurrentCourseNum(null);
                                              this.props.setCurrentInstructor(null);
                                              this.props.setPriority(null);
                                          }

                                          if (this.props.editMode) {
                                              this.setState({editOccurred: true});
                                          }
                                      }}
                                      completeMethod={this.completeDepartmentSuggestions.bind(this)}
                        />
                    </div>

                    <div className="form-field">
                        <div className="input-header"> Course Number:</div>
                        <AutoComplete suggestions={this.state.classOptions}
                                      value={this.props.currentCourseNum}
                                      onChange={(e) => {
                                          // must clear out the fields
                                          this.props.setCurrentCourseNum(e.value);
                                          this.props.setCurrentInstructor(null);
                                          this.props.setPriority(null);
                                          this.props.setConflicts(null);

                                          if (this.props.editMode && this.state.classOptions.includes(e.value)) {
                                              this.setState({editOccurred: true});
                                          }
                                      }}
                                      completeMethod={this.completeClassSuggestions.bind(this)}
                                      disabled={
                                          this.props.currentDepartment === null
                                          || this.props.currentDepartment.length === 0
                                          || !this.props.departments.includes(this.props.currentDepartment)}
                                      dropdown={true}/>
                    </div>

                    <div className="title-preferences"> Preferences</div>

                    <div className="preference-container">
                        <div className="form-field">
                            <div className="input-header"> Instructor Preference:</div>
                            <AutoComplete suggestions={
                                // because to clear the thing we put undefined, we can just put the course num in whether
                                // it is actually in the dict or not because if not it will be undefined and show nothing
                                this.state.instructorOptions}
                                          value={this.props.currentInstructor}
                                          onChange={(e) => {
                                              this.props.setCurrentInstructor(e.value);
                                              if (this.props.editMode && this.state.instructorOptions.includes(e.value)) {
                                                  this.setState({editOccurred: true});
                                              }
                                          }}
                                          completeMethod={this.completeInstructorSuggestions.bind(this)}
                                          disabled={this.props.currentCourseNum === null}
                                          dropdown={true}/>
                        </div>
                        <div className="form-field ignore-class-types">
                            <div className="input-header"> Ignore Class Types:</div>
                            <ListBox value={
                                // same as above with the undefined
                                this.props.conflicts}
                                     options={this.getClassTypeOptions(this.props.currentCourseNum)}
                                     onChange={(e) => {
                                         this.props.setConflicts(e.value);
                                         if (this.props.editMode) {
                                             this.setState({editOccurred: true});
                                         }
                                     }}
                                     multiple={true}
                                     disabled={this.props.currentCourseNum === null}/>
                        </div>

                        <div className="form-field">
                            <div className="input-header"> Importance:</div>
                            <Rating value={
                                // same as above with undefined
                                this.props.priority}
                                    onChange={(e) => {
                                        this.props.setPriority(e.value);
                                        if (this.props.editMode) {
                                            this.setState({editOccurred: true});
                                        }
                                    }}
                                    stars={3}
                                    disabled={this.props.currentCourseNum === null}
                            />
                        </div>
                    </div>
                    <div style={{display: "inline-block"}}>
                        {this.props.editMode ? deleteButton : addButton}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
