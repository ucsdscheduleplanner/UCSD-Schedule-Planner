import React, {Component} from 'react';
import {BACKEND_URL} from "../settings";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {addClass} from "../actions/index";
import {Rating} from "primereact/components/rating/Rating";
import {ListBox} from "primereact/components/listbox/ListBox";
import {Button} from "primereact/components/button/Button";
import {AutoComplete} from "primereact/components/autocomplete/AutoComplete";
import {setUID} from "../actions/scheduleActions";
import "../css/ClassInput.css";


const codeToClassType = {
    "AC_KEY": "Activity",
    "CL_KEY": "Clinical Clerkship",
    "CO_KEY": "Conference",
    "DI_KEY": "Discussion",
    "FI_KEY": "Final Exam",
    "FM_KEY": "Film",
    "FW_KEY": "Fieldwork",
    "IN_KEY": "Independent Study",
    "IT_KEY": "Internship",
    "LA_KEY": "Lab",
    "LE_KEY": "Lecture",
    "MI_KEY": "Midterm",
    "MU_KEY": "Make-up Session",
    "OT_KEY": "Other Additional Meeting",
    "PB_KEY": "Problem Session",
    "PR_KEY": "Practicum",
    "RE_KEY": "Review Session",
    "SE_KEY": "Seminar",
    "ST_KEY": "Studio",
    "TU_KEY": "Tutorial",
};

export class ClassInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duplicate: false,
            classTypesPerClass: [],
            instructorsPerClass: [],
            instructorOptions: [],
            currentInstructor: null,
            selectedConflicts: [],
            departments: [],
            departmentOptions: [],
            classes: [],
            classOptions: [],
            currentDepartment: null,
            currentCourseNum: null,
        };
    }

    componentDidMount() {
        this.getDepartments();
        this.getClassTypes();
    }

    getDepartments() {
        let that = this;
        fetch(`${BACKEND_URL}/api_department`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'get'
        })
            .then(res => res.json())
            .then(res => {
                let departments = res.map((resObj) => resObj["DEPT_CODE"]);
                that.setState({
                    "departments": departments,
                });
            });
    }

    /**
     * Update the class list with classes from the given department.
     */
    getClasses(department) {
        // need this for context
        let that = this;
        fetch(`${BACKEND_URL}/api_classes?department=${department}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'get'
        })
            .then(res => res.json())
            .then(res => {
                // putting the response inside unsorted list
                let unsorted = res.map((dict) => dict["COURSE_NUM"]);

                // sorting based on comparator for the course nums
                let sortedClasses = unsorted.sort((element1, element2) => {
                    // match numerically
                    let num1 = parseInt(element1.match(/\d+/)[0], 10);
                    let num2 = parseInt(element2.match(/\d+/)[0], 10);

                    if (num1 < num2) return -1;
                    if (num2 < num1) return 1;
                    // checking lexicographically if they are the same number
                    if (element1 < element2) return -1;
                    if (element2 < element1) return 1;
                    return 0;
                });

                let classTypesPerClass = {};
                let instructorsPerClass = {};
                for (let dict of res) {
                    classTypesPerClass[dict["COURSE_NUM"]] = Object.keys(dict).filter((property) => {
                        return property.endsWith("KEY") && dict[property] !== null;
                    }).map((classTypeStr) => {
                        return {label: codeToClassType[classTypeStr], value: codeToClassType[classTypeStr]};
                    });

                    instructorsPerClass[dict["COURSE_NUM"]] = dict["INSTRUCTOR"].split("\n");
                    instructorsPerClass[dict["COURSE_NUM"]] = instructorsPerClass[dict["COURSE_NUM"]]
                        .filter((instructor) => instructor.length > 0)
                        .map((instructor) => instructor.trim());
                }

                that.setState({
                    classes: sortedClasses,
                    classTypesPerClass: classTypesPerClass,
                    instructorsPerClass: instructorsPerClass
                });
            });
    }

    clearFields(fields) {
        let clearObj = fields.reduce((accumulator, field) => {
            accumulator[field] = null;
            return accumulator;
        }, {});
        this.setState(clearObj);
    }

    completeDepartmentSuggestions(event) {
        let departmentOptions = this.state.departments.filter((department) => {
            return department.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({departmentOptions: departmentOptions});
    }

    completeClassSuggestions(event) {
        let classOptions = this.state.classes.filter((Class) => {
            return Class.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({classOptions: classOptions});
    }

    completeInstructorSuggestions(event) {
        let instructorOptions = this.state.instructorsPerClass[this.state.currentCourseNum].filter((instructor) => {
            return instructor.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({instructorOptions: instructorOptions});
    }

    getClassTypes() {
        fetch(`${BACKEND_URL}/api_class_types`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'post'
        })
            .then(res => res.json())
            .then(res => {
                let classTypeNames = res['CLASS_TYPES'].sort();

                // must convert into a dict first for options
                let classTypes = classTypeNames.map((element) => ({"key": element, "text": element, "value": element}));
                this.setState({
                    classTypes: classTypes
                });
            });
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
                                          this.getClasses.call(this, e.value);
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
                            <AutoComplete suggestions={this.state.instructorsPerClass[this.state.currentCourseNum]}
                                          value={this.state.currentInstructor}
                                          onChange={(e) => this.setState({currentInstructor: e.value})}
                                          completeMethod={this.completeInstructorSuggestions.bind(this)}
                                          disabled={this.state.currentCourseNum === null}
                                          dropdown={true}/>
                        </div>
                        <div className="form-field">
                            <div className="input-header"> Ignore Class Types:</div>
                            <ListBox value={this.state.selectedConflicts}
                                     options={this.state.classTypesPerClass[this.state.currentCourseNum]}
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        addClass: addClass,
        setUID: setUID,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection,
        schedule: state.ScheduleGeneration.schedule,
        uid: state.ScheduleGeneration.uid,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassInput)
