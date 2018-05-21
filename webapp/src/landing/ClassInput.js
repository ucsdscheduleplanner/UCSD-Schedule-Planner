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
            selectedConflicts: [],
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
        let classOptions = this.props.classes.filter((Class) => {
            return Class.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({classOptions: classOptions});
    }

    completeInstructorSuggestions(event) {
        let instructorOptions = this.props.instructorsPerClass[this.props.currentCourseNum].filter((instructor) => {
            return instructor.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({instructorOptions: instructorOptions});
    }

    handleSubmit() {
        if (this.props.currentCourseNum === null || this.props.currentDepartment === null) return;
        let classTitle = `${this.props.currentDepartment} ${this.props.currentCourseNum}`;
        // testing whether this is a duplicate class
        let duplicate = Object.values(this.props.selectedClasses).reduce(function (accumulator, previousClass) {
            return accumulator || classTitle === previousClass['class_title']
        }, false);

        if (!duplicate) {
            // constructing new class to be added to UI
            let newClass = {};
            newClass['class_title'] = classTitle;
            newClass['course_num'] = this.props.currentCourseNum;
            newClass['department'] = this.props.currentDepartment;
            newClass['priority'] = this.props.priority;
            newClass['conflicts'] = this.props.selectedConflicts;
            newClass['currentInstructor'] = this.props.currentInstructor;

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
                                      value={this.props.currentDepartment}
                                      onChange={(e) => {
                                          this.props.setCurrentDepartment(e.value);
                                          this.props.setCurrentCourseNum(null);
                                          this.props.setCurrentInstructor(null);
                                          this.props.setPriority(null);
                                      }}
                                      completeMethod={this.completeDepartmentSuggestions.bind(this)}
                                      onSelect={(e) => {
                                          this.props.getClasses.call(this, e.value);
                                          if (e.value !== this.props.currentDepartment) {
                                              this.props.setCurrentCourseNum(null);
                                              this.props.setCurrentInstructor(null);
                                              this.props.setPriority(null);
                                          }
                                      }}/>
                    </div>

                    <div className="form-field">
                        <div className="input-header"> Course Number:</div>
                        <AutoComplete suggestions={this.state.classOptions}
                                      value={this.props.currentCourseNum}
                                      onChange={(e) => this.props.setCurrentCourseNum(e.value)}
                                      onSelect={(e) => {
                                          if (e.value !== this.state.currentCourseNum) {
                                              this.props.setCurrentInstructor(null);
                                              this.props.setPriority(null);
                                          }
                                      }}
                                      completeMethod={this.completeClassSuggestions.bind(this)}
                                      disabled={this.props.currentDepartment === null
                                      || this.props.currentDepartment.length === 0}
                                      dropdown={true}/>
                    </div>

                    <div className="title-preferences"> Preferences</div>

                    <div className="preference-container">
                        <div className="form-field">
                            <div className="input-header"> Instructor Preference:</div>
                            <AutoComplete suggestions={this.props.instructorsPerClass[this.props.currentCourseNum]}
                                          value={this.props.currentInstructor}
                                          onChange={(e) => this.props.setCurrentInstructor(e.value)}
                                          completeMethod={this.completeInstructorSuggestions.bind(this)}
                                          disabled={this.props.currentCourseNum === null}
                                          dropdown={true}/>
                        </div>
                        <div className="form-field ignore-class-types">
                            <div className="input-header"> Ignore Class Types:</div>
                            <ListBox value={this.props.conflicts}
                                     options={this.props.classTypesPerClass[this.props.currentCourseNum]}
                                     onChange={(e) => this.props.setConflicts(e.value)}
                                     multiple={true}
                                     disabled={this.props.currentCourseNum === null}/>
                        </div>

                        <div className="form-field">
                            <div className="input-header"> Importance:</div>
                            <Rating value={this.props.priority}
                                    onChange={(e) => this.props.setPriority(e.value)}
                                    stars={3}/>
                        </div>
                    </div>
                    <div className="form-button" onClick={this.handleSubmit.bind(this)}>
                        <Button label="Add Class" style={{padding: ".25em 1em"}}
                                disabled={this.props.currentCourseNum === null}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
