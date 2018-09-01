/*
    This class will hold the form for inputting classes.
 */

import React, {Component} from 'react';
import WeekCalendar from '../utils/WeekCalendar'
import "../css/MainPanel.css";
import {connect} from "react-redux";
import {ProgressBar} from 'primereact/components/progressbar/ProgressBar';

class MainPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            priority: null,
            city: null,
            cities: null,
        };
    }

    render() {
        const calendar = (
            <WeekCalendar
                key={this.props.scheduleKey}
                messageHandler={this.props.messageHandler}
                schedule={this.props.schedule}/>
        );

        const progressBar = (
            <ProgressBar showValue={true}
                         value={Math.round(100 * this.props.generatingProgress / this.props.totalNumPossibleSchedule)}/>
        );

        return (
            <div className="main-panel">
                <div className="class-calendar">
                    <div className="title"> UCSD Schedule Planner</div>
                    { this.props.generating ? progressBar : calendar }
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        scheduleKey: state.ScheduleGeneration.scheduleKey,
        messageHandler: state.ClassInput.messageHandler,
        generateSuccess: state.ScheduleGeneration.generateSuccess,
        generatingProgress: state.ScheduleGeneration.generatingProgress,
        totalNumPossibleSchedule: state.ScheduleGeneration.totalNumPossibleSchedule,
        generating: state.ScheduleGeneration.generating,
        schedule: state.ScheduleGeneration.schedule
    };
}

export default connect(mapStateToProps, null)(MainPanel);