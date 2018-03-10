import React, {Component} from 'react';
import ClassView from './landing/ClassView.js';
import {ClassInput} from './landing/ClassInput.js'
import ClassDisplay from './landing/ClassDisplay.js';
import {generateSchedule} from "./schedulegeneration/ScheduleGenerator";
import {Button, Container, Grid, Header, Transition, Segment} from 'semantic-ui-react'
import Calendar from "./utils/Calendar";

export default class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarError: false,
            enableCalendar: false,
            schedule: [],

            selectedClass: undefined,
            selectedConflicts: [],
            departmentOptions: [],
            classOptions: [],
            selectedClasses: [],
            currentDepartment: null
        };
    }


    deleteClassView(params) {
        if(params['deleteClassView']) {
            let deletedClass = params['delete'];
            this.setState({selectedClasses: this.state.selectedClasses.filter(selectedClass => selectedClass !== deletedClass)});
        }
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
                    throw new Error("No valid schedules!");
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

    addClass(newClass) {
        this.setState({
            selectedClasses: [...this.state.selectedClasses, newClass],
            selectedConflicts: []
        });
    }

    render() {
        return (
            <React.Fragment>
                <Grid columns={2} padded>
                    <Grid.Column>
                        <Container>
                            <ClassInput setValues={this.setValues.bind(this)} />
                        </Container>
                    </Grid.Column>
                    <Grid.Column>
                        <Container style={{width: "90%"}}>
                            <ClassDisplay
                                selectedClasses={this.state.selectedClasses}
                                deleteClassView={this.deleteClassView.bind(this)}
                                generateSchedule={this.generateSchedule.bind(this)}
                            />
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

