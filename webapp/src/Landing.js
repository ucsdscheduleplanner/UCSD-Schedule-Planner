import React, {Component} from 'react';
import ClassView from './ClassView.js';
import ClassInput from './ClassInput.js'
import './Landing.css'
import {generateSchedule} from "./ScheduleGenerator";
import {Button, Container, Grid, Header, Label, Transition, Segment} from 'semantic-ui-react'
import Calendar from "./Calendar";
import {BACKENDURL} from "./settings";

export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarError: false,
            enableCalendar: false,
            schedule: [],

            selectedClass: undefined,
            departmentOptions: [],
            classOptions: [],
            selectedClasses: [],
            currentDepartment: null
        };
    }

    deleteClassView(deletedClass) {
        this.setState({
            selectedClasses: this.state.selectedClasses.filter(selectedClass => selectedClass !== deletedClass)
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
                    throw "No valid schedules!"
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

    setValues(state, callback) {
        this.setState(state, callback);
    }

    addClass() {
        if (!this.state.selectedClass || !this.state.selectedClasses) return;
        let newObj = {};
        newObj['class'] = this.state.selectedClass;
        this.setState({
            selectedClasses: [...this.state.selectedClasses, newObj]
        });
    }

    render() {
        let selectedClasses = this.state.selectedClasses.map((data, index) => {
            if (data !== undefined && data !== null) return <ClassView key={index}
                                                                       data={data}
                                                                       deleteClassView={this.deleteClassView.bind(this)}/>
        });

        return (
            <React.Fragment>
                <Grid columns={2} padded>
                    <Grid.Column>
                        <Container>
                            <ClassInput setValues={this.setValues.bind(this)}
                                        addClass={this.addClass.bind(this)} />
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
                    <Transition unmountOnHide={true} visible={this.state.calendarError} animation="shake"
                                duration={500}>
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

