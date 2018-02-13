import React, {Component} from 'react';
import ClassView from './ClassView.js';
import ClassInput from './ClassInput.js'
import './Landing.css'
import {generateSchedule} from "./ScheduleGenerator";
import {Button, Container, Grid, Header, Label, Transition, Segment} from 'semantic-ui-react'
import Calendar from "./Calendar";

export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarError: false,
            enableCalendar: false,
            schedule: [],


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

    changeStateToggle(key) {
        let newBool = this.state[key];
        let newState = {};
        if (newBool === undefined || newBool === null) {
            newBool = false;
        }
        newState[key] = !newBool;

        this.setState(newState);
    }

    handleSubmit() {
        if (!this.state.selectedClass || !this.state.selectedClasses) return;
        let newObj = {};
        newObj['class'] = this.state.selectedClass;
        this.setState({
            selectedClasses: [...this.state.selectedClasses, newObj]
        });
    }

    deleteClassView(deletedClass) {
        this.setState({
            selectedClasses: this.state.selectedClasses.filter(selectedClass => selectedClass !== deletedClass)
        });
    }

    handleDepartmentChange(key, value) {
        console.log(key);
        console.log(value);

        fetch(`http://Ucsd-Webscraper-Backend-dev.us-west-2.elasticbeanstalk.com/classes?department=${value}`, {
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
                    let new_dict = {"key": dict["COURSE_NUM"], "text": dict["COURSE_NUM"], "value": dict["COURSE_NUM"]};
                    classes.push(new_dict);
                }
                this.setState({
                    "classOptions": classes
                });
            });
    }

    getDepartments() {
        fetch('http://Ucsd-Webscraper-Backend-dev.us-west-2.elasticbeanstalk.com/department', {
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

    generateSchedule() {
        let that = this;
        this.setState({
            enableCalendar: false,
            calendarError: false,
            schedule: []
        });

        generateSchedule(this.state.selectedClasses)
            .then(schedule => {
                console.log(schedule);
                if (schedule.length > 0) {
                    that.setState({
                        schedule: schedule,
                        enableCalendar: true
                    });
                } else {

                }
            })
            .catch(error => {
                that.setState({
                    calendarError: true,
                });
            });
    }

    clearSchedule() {
        this.setState({enableCalendar: false});
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
            if (data !== undefined && data !== null) return <ClassView key={index} data={data}
                                                                       deleteClassView={this.deleteClassView.bind(this)}/>
        });

        return (
            <React.Fragment>
                <Grid columns={2} padded>
                    <Grid.Column>
                        <Container>
                            <ClassInput handleSubmit={this.handleSubmit.bind(this)}
                                        classOptions={this.state.classOptions}
                                        departmentOptions={this.state.departmentOptions}
                                        handleDepartmentChange={this.handleDepartmentChange.bind(this)}
                                        changeState={this.changeState.bind(this)}
                            />
                        </Container>
                    </Grid.Column>
                    <Grid.Column>
                        <Container style={{width: "90%"}}>
                            {selectedClasses}
                            {selectedClasses.length > 0 &&
                            <Button positive floated="right"
                                    onClick={this.generateSchedule.bind(this)}
                                    content="Generate Schedule"/>}

                        </Container>
                    </Grid.Column>
                </Grid>
                <Container style={{marginBottom: "5em"}}>
                    <Transition unmountOnHide={true} visible={this.state.calendarError} animation="shake" duration={500}>
                        <Segment color="red" inverted raised={true}>
                            <Header textAlign="center" as="h1" content="That schedule is not possible!"/>
                        </Segment>
                    </Transition>

                    <Calendar enabled={this.state.enableCalendar}
                              schedule={this.state.schedule}
                              clearSchedule={this.clearSchedule.bind(this)}
                    />
                </Container>
            </React.Fragment>
        );
    }
}

