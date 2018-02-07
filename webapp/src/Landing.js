import React, {Component} from 'react';
import ClassView from './ClassView.js';
import './Landing.css'
import {
    Container,
    Divider,
    Dropdown,
    Form,
    Button,
    Message,
    Grid,
    Header,
    Transition,


    Icon,
    Image,
    List,
    Label,
    Input,
    Menu,
    Segment,
    Visibility
} from 'semantic-ui-react'


import {IntroAnimation} from "./IntroAnimation.js";
import {Heap} from "./Heap";

const options = [
    {key: 'm', text: 'Male', value: 'male'},
    {key: 'f', text: 'Female', value: 'female'},
];


export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeOut: false,
            animationComplete: false,
            textVisible: false,
            selectedClass: undefined,
            departmentOptions: [],
            classOptions: [],
            selectedClasses: []
        };
    }

    changeState(key, value) {
        let newState = {};
        newState[key] = value;
        this.setState(newState);
    }


    handleSubmit() {
        console.log('hi');
        this.setState({
            selectedClasses: [...this.state.selectedClasses, this.state.selectedClass]
        });
    }

    handleDepartmentChange(key, value) {
        console.log(key);
        console.log(value);

        fetch(`/classes?department=${value}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'post'
        })
            .then(res => res.json())
            .then(res => {
                let classes = [];
                for (let dict of res) {
                    let new_dict = {"key": dict["COURSE_NUM"], "text": dict["COURSE_NUM"], "value": dict["COURSE_NUM"]}
                    classes.push(new_dict);
                }
                this.setState({
                    "classOptions": classes
                });
            });
    }

    getDepartments() {
        fetch('/department', {
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

    componentDidMount() {
        this.getDepartments();
        let that = this;
        setTimeout(function () {
            that.setState({
                textVisible: true
            });
        }, 1000);
        setTimeout(function () {
            that.setState({
                fadeOut: true
            });
        }, 1500);
        setTimeout(function () {
            that.setState({
                animationComplete: true
            });
        }, 2000);
    }

    render() {
        let selectedClasses = this.state.selectedClasses.map((data, index) => {
            if(data !== undefined && data !== null) return <ClassView key={index} class={data}/>
        });

        const {value} = this.state;

        return (
            <React.Fragment>
                <Grid columns={2} padded>
                    <Grid.Column>
                        <Container>
                            <Segment color="teal" raised>
                                <Form onSubmit={this.handleSubmit.bind(this)} style={{display: "table", width: "100%  "}}>
                                    <Form.Group widths='equal'>
                                        <Form.Select search fluid
                                                     onChange={(e, {value}) => this.handleDepartmentChange('department', value)}
                                                     label='Department'
                                                     options={this.state.departmentOptions}
                                                     placeholder='Department'/>
                                        <Form.Select search fluid
                                                     onChange={(e, {value}) => this.changeState('selectedClass', value)}
                                                     label='Classes' placeholder='Classes'
                                                     options={this.state.classOptions}/>
                                    </Form.Group>
                                    <Form.Group inline>
                                        <label>Ignore Overlaps: </label>
                                        <Form.Radio label='Lecture' value='sm' checked={value === 'sm'}
                                                    onChange={this.handleChange}/>
                                        <Form.Radio label='Final' value='md' checked={value === 'md'}
                                                    onChange={this.handleChange}/>
                                        <Form.Radio label='Other' value='lg' checked={value === 'lg'}
                                                    onChange={this.handleChange}/>
                                    </Form.Group>
                                    <Form.Button positive floated="right" content="Submit"/>
                                </Form>
                            </Segment>
                        </Container>
                    </Grid.Column>
                    <Grid.Column>
                        {selectedClasses}
                    </Grid.Column>
                </Grid>
            </React.Fragment>
        );
    }
}

