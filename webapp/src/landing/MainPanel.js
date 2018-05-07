/*
    This class will hold the form for inputting classes.
 */

import React, {Component} from 'react';
import ClassInput from './ClassInput';
import WeekCalendar from '../utils/WeekCalendar'
import "../css/MainPanel.css";
import {connect} from "react-redux";

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
        if (this.props.scheduleScreen) {
            return (
                    <div className="main-panel">
                        <div className="title"> UCSD Schedule Planner</div>
                        <WeekCalendar
                            schedule={this.props.schedule}
                        />
                    </div>
            );
        } else {
            return (
                <div className="main-panel">
                    <div className="title"> UCSD Schedule Planner</div>
                    <ClassInput/>
                </div>
            );
        }

    }
}

function mapStateToProps(state) {
    return {
        generating: state.ScheduleGeneration.generating,
        scheduleScreen: state.ScheduleGeneration.scheduleScreen,
        schedule: state.ScheduleGeneration.schedule
    };
}

export default connect(mapStateToProps, null)(MainPanel);