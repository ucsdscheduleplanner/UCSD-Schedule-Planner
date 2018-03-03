import React, {Component} from 'react';
import {
    Form,
    Segment,
    Label,
    Checkbox
} from 'semantic-ui-react';
import {BACKENDURL} from "./settings";
import Grid from "semantic-ui-react/dist/es/collections/Grid/Grid";
import Dropdown from "semantic-ui-react/dist/es/modules/Dropdown/Dropdown";


export default class ClassInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ignoreLE: false,

            classTypes: [],
            selectedConflicts: [],
            departmentOptions: [],
            classOptions: [],
            selectedClasses: [],
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
                let classes = [];
                let unsorted = [];
                for (let dict of res) {
                    unsorted.push(dict["COURSE_NUM"]);
                }
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

                for (let element of sorted) {
                    let new_dict = {"key": element, "text": element, "value": element};
                    classes.push(new_dict);
                }

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
                // must convert into a dict first for options
                let classTypes = [];
                let classTypeNames = res['CLASS_TYPES'].sort();

                for (let element of classTypeNames) {
                    let new_dict = {"key": element, "text": element, "value": element};
                    classTypes.push(new_dict);
                }
                this.setState({
                    classTypes: classTypes
                });
            });
    }

    handleSubmit() {
        return this.props.setValues(this.state, this.props.addClass);
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


        /*
            <Form.Group inline>
        <label>Ignore Overlaps: </label>
        <Form.Radio slider label='Lecture' value='ignoreLecture'
                    checked={this.state['ignoreLecture'] === true}
                    onChange={(e, {value}) => this.changeStateToggle(value)}/>
        <Form.Radio slider label='Other' value='ignoreOther'
                    checked={this.state['ignoreOther'] === true}
                    onChange={(e, {value}) => this.changeStateToggle(value)}/>
    </Form.Group>
    */
    }
}