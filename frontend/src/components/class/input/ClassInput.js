import React, {PureComponent} from 'react';
import memoize from 'memoize-one';
import {Rating} from "primereact/components/rating/Rating";
import {ListBox} from "primereact/components/listbox/ListBox";
import {Button} from "primereact/components/button/Button";
import {AutoComplete} from "primereact/components/autocomplete/AutoComplete";
import "./ClassInput.css";
import {ClassInputForm} from "./form/ClassInputForm";


export default class ClassInput extends PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.props.inputHandler.autosave();
    }

    getDepartmentSuggestions = memoize((query, departments) => {
        if (!query || !departments)
            return departments;
        return departments.filter((department) => {
            return department.toLowerCase().startsWith(query.toLowerCase());
        });
    });

    getCourseNumSuggestions = memoize((query, courseNums) => {
        if (!query || !courseNums)
            return courseNums;
        return courseNums.filter((courseNum) => {
            return courseNum.toLowerCase().startsWith(query.toLowerCase());
        });
    });

    getInstructorSuggestions = memoize((query, instructors) => {
        if (!query || instructors)
            return instructors;
        return instructors.filter((instructor) => {
            return instructor.toLowerCase().startsWith(query.toLowerCase());
        });
    });

    getDescriptionForCourseNum(courseNum) {
        return courseNum + " - " + this.props.descriptionsPerClass[courseNum];
    }

    render() {
        // let deleteButton = (
        //     <div className="form-button">
        //         <Button label="Delete Class" className="ui-button-danger"
        //                 disabled={this.props.courseNum === null}
        //                 onClick={() => this.props.inputHandler.handleRemove()}
        //         />
        //         <Button label="Done editing" className="ui-button-info"
        //                 disabled={this.props.courseNum === null}
        //                 onClick={() => this.props.inputHandler.handleEdit()}
        //         />
        //     </div>
        // );
        //
        // let addButton = (
        //     <div className="form-button" onClick={() => this.props.inputHandler.handleAdd()}>
        //         <Button label="Add Class" disabled={this.props.courseNum === null}/>
        //     </div>
        // );
        //
        // let departmentAutoComplete = (
        //     <div className="form-field">
        //         <div className="input-header"> Department:</div>
        //         <AutoComplete id="department"
        //                       suggestions={this.getDepartmentSuggestions(this.props.department, this.props.departments)}
        //                       dropdown={true}
        //                       value={this.props.department}
        //                       onChange={(e) => this.props.inputHandler.onDepartmentChange(e.value)}
        //                       // need this dummy method to cause a rerender cause primereact
        //                       completeMethod={(e) => this.setState({state: this.state})}
        //         />
        //     </div>
        // );
        //
        // let courseNumAutoComplete = (
        //     <div className="form-field">
        //         <div className="input-header"> Course Number:</div>
        //         <AutoComplete id="course-number"
        //                       suggestions={this.getCourseNumSuggestions(this.props.courseNum, this.props.courseNums)}
        //                       itemTemplate={this.getDescriptionForCourseNum.bind(this)}
        //                       value={this.props.courseNum}
        //                       onChange={(e) => this.props.inputHandler.onCourseNumChange(e.value)}
        //                       completeMethod={(e) => this.setState({state: this.state})}
        //                       disabled={!this.props.departments.includes(this.props.department)}
        //                       dropdown={true}/>
        //     </div>
        // );
        //
        // let instructorPreference = (
        //     <div className="form-field">
        //         <div className="input-header"> Instructor Preference:</div>
        //         <AutoComplete id="instructor"
        //                       suggestions={this.getInstructorSuggestions(this.props.instructor, this.props.instructors)}
        //                       value={this.props.instructor}
        //                       onChange={(e) => this.props.inputHandler.onInstructorChange(e.value)}
        //                       completeMethod={(e) => this.setState({state: this.state})}
        //                       disabled={!this.props.courseNums.includes(this.props.courseNum)}
        //                       dropdown={true}/>
        //     </div>
        // );
        //
        // let ignoreClassPreference = (
        //     <div className="form-field">
        //         <div className="input-header"> Class Types to Ignore:</div>
        //         <ListBox value={
        //             // same as above with the undefined
        //             this.props.classTypesToIgnore}
        //                  options={this.props.types}
        //                  onChange={(e) => this.props.inputHandler.onClassTypesToIgnoreChange(e.value)}
        //                  multiple={true}
        //                  disabled={!this.props.courseNums.includes(this.props.courseNum)}/>
        //     </div>
        // );
        //
        // let priorityPreference = (
        //     <div className="form-field">
        //         <div className="input-header"> Importance:</div>
        //         <Rating value={
        //             // same as above with undefined
        //             this.props.priority}
        //                 onChange={(e) => this.props.inputHandler.onPriorityChange(e.value)}
        //                 stars={3}
        //                 disabled={this.props.courseNum === null}
        //         />
        //     </div>
        // );
        //
        // return (
        //     <div className="content">
        //         {departmentAutoComplete}
        //         {courseNumAutoComplete}
        //
        //         <div className="ci--title-preference"> Preferences</div>
        //
        //         {instructorPreference}
        //         {ignoreClassPreference}
        //         {priorityPreference}
        //
        //         <div style={{display: "inline-block"}}>
        //             {this.props.editMode ? deleteButton : addButton}
        //         </div>
        //     </div>
        // )
        return (
            <React.Fragment>
                <div className="class__input__form">
                    <ClassInputForm/>
                </div>
            </React.Fragment>
        )
    }
}
