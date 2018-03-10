import React, {Component} from 'react';
import {
    Form,
    Segment,
    Label,
    Checkbox
} from 'semantic-ui-react';
import {BACKENDURL} from "../settings";
import addClass from "../reducers/AddClass";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";


export class ClassInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            classTypes: [],
            selectedConflicts: [],
            departmentOptions: [],
            classOptions: [],
            currentDepartment: null,
        };
    }

    componentDidMount() {
        this.getDepartments();
        this.getClassTypes();
    }

    getDepartments() {
        fetch(`${BACKENDURL}/department`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'post'
        })
            .then(res => res.json())
            .then(res => {
                let departments = [];
                for (let dict of res) {
                    let new_dict = {"key": dict["DEPT_CODE"], "text": dict["DEPT_CODE"], "value": dict["DEPT_CODE"]};
                    departments.push(new_dict);
                }
                this.setState({
                    "departmentOptions": departments,
                });
            });
    }

    /**
     * Update the class list with classes from the given department.
     */
    updateClassList(department) {
        fetch(`${BACKENDURL}/classes?department=${department}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'post'
        })
            .then(res => res.json())
            .then(res => {
                // putting the response inside unsorted list
                let unsorted = res.map((dict) => dict["COURSE_NUM"]);

                // sorting based on comparator
                let sorted = unsorted.sort((element1, element2) => {
                    // match numerically
                    let num1 = parseInt(element1.match(/\d+/)[0]);
                    let num2 = parseInt(element2.match(/\d+/)[0]);

                    if (num1 < num2) return -1;
                    if (num2 < num1) return 1;
                    // checking lexicographically if they are the same number
                    if (element1 < element2) return -1;
                    if (element2 < element1) return 1;
                    return 0;
                });

                let classes = sorted.map((element) => ({"key": element, "text": element, "value": element}));
                this.setState({
                    "classOptions": classes
                });
            });
    }

    getClassTypes() {
        fetch(`${BACKENDURL}/class_types`, {
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
        // set values has a callback
        let newClass = {};
        newClass['class'] = this.state.selectedClass;
        newClass['conflicts'] = this.state.selectedConflicts;

        this.props.addClass(newClass);
    }

    render() {
        return <React.Fragment>
            <Segment color="teal" raised>
                <Form onSubmit={this.props.handleSubmit}
                      style={{display: "table", width: "100%", zIndex: 1}}>
                    <Form.Group widths='equal'>
                        {/* This is the department label and such*/}
                        <Form.Select search fluid
                                     onChange={(e, {value}) => this.setState({'currentDepartment': value}, this.updateClassList.bind(this, value))}
                                     options={this.state.departmentOptions}
                                     label='Department'
                                     placeholder='Department'/>
                        {/* This is the classes label and such*/}

                        {/* Make sure the selected class gets updated */}
                        <Form.Select search fluid
                                     onChange={(e, {value}) => this.setState({'selectedClass': this.state.currentDepartment + " " + value})}
                                     label='Classes' placeholder='Classes'
                                     options={this.state.classOptions}/>
                    </Form.Group>

                    {/* Form group for ignoring conflicts in schedules */}
                    <Form.Group>
                        <Form.Select multiple
                                     search
                                     selection
                                     onChange={(e, {value}) => this.setState({'selectedConflicts': value})}
                                     label="Ignore Conflicts"
                                     placeholder='LE'
                                     options={this.state.classTypes}/>
                    </Form.Group>

                    {/* This is the master button that updates the parent with the input values */}
                    <Form.Button onClick={this.handleSubmit.bind(this)} style={{marginTop: "1em"}} positive
                                 floated="right" content="Add Class"/>
                </Form>
            </Segment>
        </React.Fragment>
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(addClass, dispatch)
    }
}

export default connect(mapDispatchToProps)(ClassInput)
