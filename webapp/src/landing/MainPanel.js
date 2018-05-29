/*
    This class will hold the form for inputting classes.
 */

import React, {Component} from 'react';
import WeekCalendar from '../utils/WeekCalendar'
import "../css/MainPanel.css";
import {connect} from "react-redux";
import ClassInputContainer from "../containers/ClassInputContainer";
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
        if(this.props.generating) {
            return (
                <ProgressBar mode="indeterminate"/>
            );
        } else if (this.props.calendarMode) {
            return (
                <div className="main-panel">
                    <div className="class-input">
                        <div className="title"> UCSD Schedule Planner</div>
                        <WeekCalendar
                            schedule={this.props.schedule}
                        />
                    </div>
                </div>
            );
        } else {
            return (
                <div className="main-panel">
                    <div className="class-calendar">
                        <div className="title"> UCSD Schedule Planner</div>
                        <ClassInputContainer/>
                    </div>
                </div>
            );
        }

    }
}


function mapStateToProps(state) {
    return {
        generatingProgress: state.ScheduleGeneration.generatingProgress,
        generating: state.ScheduleGeneration.generating,
        calendarMode: state.ScheduleGeneration.calendarMode,
        schedule: state.ScheduleGeneration.schedule
    };
}

export default connect(mapStateToProps, null)(MainPanel);