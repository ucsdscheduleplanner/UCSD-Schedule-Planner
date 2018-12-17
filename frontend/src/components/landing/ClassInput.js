import React, {PureComponent} from 'react';
import {Rating} from "primereact/components/rating/Rating";
import {ListBox} from "primereact/components/listbox/ListBox";
import {Button} from "primereact/components/button/Button";
import {AutoComplete} from "primereact/components/autocomplete/AutoComplete";
import "../../css/ClassInput.css";


export default class ClassInput extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            instructorOptions: [],
            departmentOptions: [],
            classOptions: [],
        };
        this.inputHandler = props.getInputHandler();
        console.log(this.inputHandler);
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
        console.log(this.props.instructors);
        let instructorOptions = this.props.instructors.filter((instructor) => {
                if (instructor) return instructor.toLowerCase().startsWith(event.query.toLowerCase());
                    return false;
            });
        this.setState({instructorOptions: instructorOptions});
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

    getDescriptionForCourseNum(courseNum) {
        console.log(this.props.descriptionsPerClass);
        return courseNum + " - " + this.props.descriptionsPerClass[courseNum];
    }

    render() {
        this.inputHandler = this.props.getInputHandler();
        this.inputHandler.handleEdit();

        let deleteButton = (
            <div className="form-button">
                <Button label="Delete Class" className="ui-button-danger"
                        disabled={this.props.currentCourseNum === null}
                        onClick={this.props.removeClass}
                />
                <Button label="Done editing" className="ui-button-info"
                        disabled={this.props.currentCourseNum === null}
                        onClick={this.props.enterInputMode}
                />
            </div>
        );

        let addButton = (
            <div className="form-button" onClick={this.props.addClass}>
                <Button label="Add Class" disabled={this.props.currentCourseNum === null}/>
            </div>
        );

        let departmentAutoComplete = (
            <div className="form-field">
                <div className="input-header"> Department:</div>
                <AutoComplete id="department"
                              suggestions={this.state.departmentOptions}
                              dropdown={true}
                              value={this.props.department}
                              onChange={(e) => this.inputHandler.onDepartmentChange(e.value)}
                              completeMethod={this.completeDepartmentSuggestions.bind(this)}/>
            </div>
        );

        let courseNumAutoComplete = (
            <div className="form-field">
                <div className="input-header"> Course Number:</div>
                <AutoComplete id="course-number"
                              suggestions={this.state.classOptions}
                              itemTemplate={this.getDescriptionForCourseNum.bind(this)}
                              value={this.props.courseNum}
                              onChange={(e) => this.inputHandler.onCourseNumChange(e.value)}
                              completeMethod={this.completeClassSuggestions.bind(this)}
                              disabled={!this.props.departments.includes(this.props.department)}
                              dropdown={true}/>
            </div>
        );

        let instructorPreference = (
            <div className="form-field">
                <div className="input-header"> Instructor Preference:</div>
                <AutoComplete id="instructor"
                              suggestions={
                                  // because to clear the thing we put undefined, we can just put the course num in whether
                                  // it is actually in the dict or not because if not it will be undefined and show nothing
                                  this.state.instructorOptions}
                              value={this.props.instructor}
                              onChange={(e) => this.inputHandler.onInstructorChange(e.value)}
                              completeMethod={this.completeInstructorSuggestions.bind(this)}
                              disabled={this.props.courseNum === null}
                              dropdown={true}/>
            </div>
        );

        let ignoreClassPreference = (
            <div className="form-field">
                <div className="input-header"> Ignore Class Types:</div>
                <ListBox value={
                    // same as above with the undefined
                    this.props.conflicts}
                         options={this.props.types}
                         onChange={(e) => this.inputHandler.onConflictChange(e.value)}
                         multiple={true}
                         disabled={this.props.courseNum === null}/>
            </div>
        );

        let priorityPreference = (
            <div className="form-field">
                <div className="input-header"> Importance:</div>
                <Rating value={
                    // same as above with undefined
                    this.props.priority}
                        onChange={this.props.onPriorityChange}
                        stars={3}
                        disabled={this.props.currentCourseNum === null}
                />
            </div>
        );

        return (
            <div className="content">
                {departmentAutoComplete}
                {courseNumAutoComplete}

                <div className="ci--title-preference"> Preferences</div>

                {instructorPreference}
                {ignoreClassPreference}
                {priorityPreference}

                <div style={{display: "inline-block"}}>
                    {this.props.editMode ? deleteButton : addButton}
                </div>
            </div>
        )
    }
}
