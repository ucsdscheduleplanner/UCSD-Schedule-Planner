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
            instructorOptions: [],
            currentInstructor: null,
            selectedConflicts: [],
            departmentOptions: [],
            classOptions: [],
            currentDepartment: null,
            currentCourseNum: null,
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
        let classOptions = this.props.classes.filter((Class) => {
            return Class.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({classOptions: classOptions});
    }

    completeInstructorSuggestions(event) {
        let instructorOptions = this.props.instructorsPerClass[this.state.currentCourseNum].filter((instructor) => {
            return instructor.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({instructorOptions: instructorOptions});
    }

    handleSubmit() {
        if (this.state.currentCourseNum === null || this.state.currentDepartment === null) return;
        let classTitle = `${this.state.currentDepartment} ${this.state.currentCourseNum}`;
        // testing whether this is a duplicate class
        let duplicate = Object.values(this.props.selectedClasses).reduce(function (accumulator, previousClass) {
            return accumulator || classTitle === previousClass['class_title']
        }, false);

        if (!duplicate) {
            // constructing new class to be added to UI
            let newClass = {};
            newClass['class_title'] = classTitle;
            newClass['course_num'] = this.state.currentCourseNum;
            newClass['department'] = this.state.currentDepartment;
            newClass['priority'] = this.state.priority;
            newClass['conflicts'] = this.state.selectedConflicts;
            newClass['currentInstructor'] = this.state.currentInstructor;

            // using the addClass method from the reducer
            this.props.addClass(this.props.uid, newClass);
        }
        this.props.setUID(this.props.uid + 1);
        // set duplicate so we can do some UI stuff in case
        this.setState({
            duplicate: duplicate
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="content">
                    <div className="form-field">
                        <div className="input-header"> Department:</div>
                        <AutoComplete suggestions={this.state.departmentOptions} dropdown={true}
                                      value={this.state.currentDepartment}
                                      onChange={(e) => {
                                          this.setState({currentDepartment: e.value});
                                          this.clearFields(["currentCourseNum", "currentInstructor", "priority"]);
                                      }}
                                      completeMethod={this.completeDepartmentSuggestions.bind(this)}
                                      onSelect={(e) => {
                                          this.props.getClasses.call(this, e.value);
                                          if (e.value !== this.state.currentDepartment) {
                                              this.clearFields(["currentInstructor", "currentCourseNum", "priority"]);
                                          }
                                      }}/>
                    </div>

                    <div className="form-field">
                        <div className="input-header"> Course Number:</div>
                        <AutoComplete suggestions={this.state.classOptions}
                                      value={this.state.currentCourseNum}
                                      onChange={(e) => this.setState({currentCourseNum: e.value})}
                                      onSelect={(e) => {
                                          if (e.value !== this.state.currentCourseNum) {
                                              this.clearFields(["currentInstructor", "priority"]);
                                          }
                                      }}
                                      completeMethod={this.completeClassSuggestions.bind(this)}
                                      disabled={this.state.currentDepartment === null || this.state.currentDepartment.length === 0}
                                      dropdown={true}/>
                    </div>

                    <div className="title-preferences"> Preferences</div>

                    <div className="preference-container">
                        <div className="form-field">
                            <div className="input-header"> Instructor Preference:</div>
                            <AutoComplete suggestions={this.props.instructorsPerClass[this.state.currentCourseNum]}
                                          value={this.state.currentInstructor}
                                          onChange={(e) => this.setState({currentInstructor: e.value})}
                                          completeMethod={this.completeInstructorSuggestions.bind(this)}
                                          disabled={this.state.currentCourseNum === null}
                                          dropdown={true}/>
                        </div>
                        <div className="form-field ignore-class-types">
                            <div className="input-header"> Ignore Class Types:</div>
                            <ListBox value={this.state.selectedConflicts}
                                     options={this.props.classTypesPerClass[this.state.currentCourseNum]}
                                     onChange={(e) => {
                                         this.setState({selectedConflicts: e.value});
                                     }}
                                     multiple={true}
                                     disabled={this.state.currentCourseNum === null}/>
                        </div>

                        <div className="form-field">
                            <div className="input-header"> Importance:</div>
                            <Rating value={this.state.priority}
                                    onChange={(e) => this.setState({priority: e.value})}
                                    stars={3}/>
                        </div>
                    </div>
                    <div className="form-button" onClick={this.handleSubmit.bind(this)}>
                        <Button label="Add Class" style={{padding: ".25em 1em"}}
                                disabled={this.state.currentCourseNum === null}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
