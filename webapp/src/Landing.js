import React, {Component} from 'react';
import ClassView from './landing/ClassView.js';
import ClassInput from './landing/ClassInput.js'
import {Button, Container, Grid, Header, Segment, Transition} from 'semantic-ui-react'
import Calendar from "./utils/Calendar";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {generateSchedule} from "./schedulegeneration/ScheduleGenerator";
import FileSaver from 'file-saver'

class Landing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            schedule: [],
            calendarError: false,
            enableCalendar: false
        }
    }

    handleSubmit() {
        let newState = {};
        newState.schedule = [];
        newState.calendarError = false;
        newState.enableCalendar = false;

        generateSchedule(this.props.selectedClasses)
            .then(schedule => {
                console.log(schedule);
                if (schedule.length > 0) {
                    newState.schedule = schedule;
                    newState.enableCalendar = true;
                } else {
                    newState.calendarError = true;
                }
                this.setState(newState);
            })
            .catch(error => {
                newState.calendarError = true;
                this.setState(newState);
            });
    }

    handleExportICAL() {
        let schedule = this.state.schedule;
        let request = schedule.reduce((accumulator, _class) => {
            _class.subclassList.forEach((subclass) => accumulator.push(subclass));
            return accumulator;
        }, []);

        fetch('/create_ics', {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }).then((response) => response.blob())
            .then((response) => FileSaver.saveAs(response, 'calendar.ics'));
        return request;
    }

    clearSchedule() {
        this.setState({enableCalendar: false});
    }

    render() {
        let selectedClasses = Object.keys(this.props.selectedClasses)
        // we need index to add more than one class
        // we need index for the mapping part
            .map((index, element) => (
                <ClassView
                    key={index}
                    index={index}
                />
            ));

        return (
            <React.Fragment>
                <Grid columns={2} padded>
                    <Grid.Column>
                        <Container>
                            <ClassInput/>
                        </Container>
                    </Grid.Column>
                    <Grid.Column>
                        <Container style={{width: "90%"}}>
                            {selectedClasses}
                            {
                                selectedClasses.length > 0 &&
                                <Button positive floated="right"
                                        onClick={this.handleSubmit.bind(this)}
                                        content="Generate Schedule"/>
                            }
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
                              clearSchedule={this.handleExportICAL.bind(this)}
                    />
                </Container>

            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        generateSchedule: generateSchedule
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection,
        scheduleInfo: state.ScheduleGeneration
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
