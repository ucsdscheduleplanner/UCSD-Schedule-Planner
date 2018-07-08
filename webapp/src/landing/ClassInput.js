import React, {PureComponent} from 'react';
import {Rating} from "primereact/components/rating/Rating";
import {ListBox} from "primereact/components/listbox/ListBox";
import {Button} from "primereact/components/button/Button";
import {Growl} from 'primereact/components/growl/Growl';
import {AutoComplete} from "primereact/components/autocomplete/AutoComplete";
import "../css/ClassInput.css";


export default class ClassInput extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            duplicate: false,
            instructorOptions: [],
            departmentOptions: [],
            classOptions: [],
        };
        this.message = null;
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
        if (!this.props.classes[this.props.currentDepartment]) return;

        // hits the caching layer here
        let classOptions = this.props.classes[this.props.currentDepartment].filter((Class) => {
            if(Class) return Class.toLowerCase().startsWith(event.query.toLowerCase());
            return false;
        });
        this.setState({classOptions: classOptions});
    }

    completeInstructorSuggestions(event) {
        if (this.props.instructorsPerClass && this.props.instructorsPerClass[this.props.currentDepartment]) {

            // hits the caching layer here
            let instructorOptions = this.props.instructorsPerClass[this.props.currentDepartment][this.props.currentCourseNum]
                .filter((instructor) => {
                if(instructor) return instructor.toLowerCase().startsWith(event.query.toLowerCase());
                return false;
                });
            this.setState({instructorOptions: instructorOptions});
        }
    }

    getClassTypeOptions(courseNum) {
        if (this.props.classTypesPerClass && this.props.classTypesPerClass[this.props.currentDepartment]
            && this.props.classTypesPerClass[this.props.currentDepartment][courseNum]) {
            // filtering midterms and finals for now
            // TODO find way to mess with labels and values to make this cleaner and less shaky
            return this.props.classTypesPerClass[this.props.currentDepartment][courseNum].filter((classType) => {
                return classType["label"] !== "Final Exam" && classType["label"] !== "Midterm";
            });
        }
        return undefined;
    }

    showMessage(type, message) {
        this.message.show({severity: type, summary: message, life: 1000});
    }

    handleSubmit() {
        let error = false;
        // doing pre-checking
        if (this.props.currentCourseNum === null || this.props.currentDepartment === null) return;
        let classTitle = `${this.props.currentDepartment} ${this.props.currentCourseNum}`;
        // testing whether this is a duplicate class
        let duplicate = Object.values(this.props.selectedClasses).reduce(function (accumulator, previousClass) {
            return accumulator || classTitle === previousClass['class_title']
        }, false);

        // error checking on department and course num
        if (!this.props.departments.includes(this.props.currentDepartment)) error = true;
        if (!this.props.classes[this.props.currentDepartment].includes(this.props.currentCourseNum)) error = true;

        if (!duplicate && !error) {
            // constructing new class to be added to UI
            let newClass = {};
            newClass['class_title'] = classTitle;
            newClass['course_num'] = this.props.currentCourseNum;
            newClass['department'] = this.props.currentDepartment;
            newClass['priority'] = this.props.priority;
            newClass['conflicts'] = this.props.conflicts;
            newClass['instructor'] = this.props.currentInstructor;

            // using the addClass method from the reducer
            this.props.addClass(this.props.uid, newClass);

            // do cleanup
            this.props.setCurrentInstructor(null);
            this.props.setCurrentCourseNum(null);
            this.props.setPriority(null);
            this.props.setConflicts(null);
        } else {
            this.showMessage("error", "Failed to add class");
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
                (accumulator || classTitle === previousClass['class_title'])
        }, false);

        if (!duplicate) {
            // constructing new class to be added to UI
            let newClass = {};
            newClass['class_title'] = classTitle;
            newClass['course_num'] = this.props.currentCourseNum;
            newClass['department'] = this.props.currentDepartment;
            newClass['priority'] = this.props.priority;
            newClass['conflicts'] = this.props.conflicts;
            newClass['instructor'] = this.props.currentInstructor;

            // using the edit method from the reducer
            this.props.editClass(this.props.editUID, newClass);
            this.message.show({severity: 'success', summary: 'Edit Successful', life: 750});
            this.props.exitEditMode();
        }
        // set duplicate so we can do some UI stuff in case
        this.setState({
            duplicate: duplicate
        });
    }

    handleRemove() {
        this.props.removeClass(this.props.editUID);
        this.showMessage("success", "Successfully removed class");
        this.props.exitEditMode();
    }

    showError() {
        this.showMessage("error", "Failed to generate schedule");
    }

    render() {
        let editButton = (
            <div className="form-button">
                <Button label="Edit Class" style={{padding: ".25em 1em"}}
                        disabled={this.props.currentCourseNum === null}
                        onClick={this.handleEdit.bind(this)}
                />

                <Button label="Back to input" className="ui-button-info" style={{padding: ".25em 1em"}}
                        disabled={this.props.currentCourseNum === null}
                        onClick={this.props.exitEditMode}
                />

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

        return (
            <React.Fragment>
                <div className="content">
                    <div className="form-field">
                        <div className="input-header"> Department:</div>
                        <AutoComplete suggestions={this.state.departmentOptions} dropdown={true}
                                      value={this.props.currentDepartment}
                                      onChange={(e) => {
                                          this.props.setCurrentDepartment(e.value.toUpperCase());
                                          this.props.setCurrentCourseNum(null);
                                          this.props.setCurrentInstructor(null);
                                          this.props.setPriority(null);

                                          if(!this.props.departments.includes(e.value)) {
                                              return;
                                          }

                                          // don't requery if we have the class already
                                          if (this.props.classes[e.value]) {
                                              console.info("Found classes cached, will use that.");
                                              return;
                                          }
                                          this.props.getClasses.call(this, e.value);
                                          // check if the thing we selected is the same as the one we already had
                                          if (e.value !== this.props.currentDepartment) {
                                              this.props.setCurrentCourseNum(null);
                                              this.props.setCurrentInstructor(null);
                                              this.props.setPriority(null);
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
                                      }}
                                      onSelect={(e) => {
                                          // only clear if we select something else
                                          if (e.value !== this.state.currentCourseNum) {
                                              this.props.setCurrentInstructor(null);
                                              this.props.setPriority(null);
                                              this.props.setConflicts(null);
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
                                          onChange={(e) => this.props.setCurrentInstructor(e.value)}
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
                                     onChange={(e) => this.props.setConflicts(e.value)}
                                     multiple={true}
                                     disabled={this.props.currentCourseNum === null}/>
                        </div>

                        <div className="form-field">
                            <div className="input-header"> Importance:</div>
                            <Rating value={
                                // same as above with undefined
                                this.props.priority}
                                    onChange={(e) => this.props.setPriority(e.value)}
                                    stars={3}
                                    disabled={this.props.currentCourseNum === null}
                            />
                        </div>
                    </div>
                    <div style={{display: "inline-block"}}>
                        {this.props.editMode ? editButton : addButton}
                        <Growl ref={(el) => {
                            this.message = el;
                        }}/>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
