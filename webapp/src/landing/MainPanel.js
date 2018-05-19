/*
    This class will hold the form for inputting classes.
 */

import React, {Component} from 'react';
import WeekCalendar from '../utils/WeekCalendar'
import "../css/MainPanel.css";
import {connect} from "react-redux";
import "../tests/SimpleIntervalTreeTest.js";
import ClassInputContainer from "../containers/ClassInputContainer";

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
        generating: state.ScheduleGeneration.generating,
        scheduleScreen: state.ScheduleGeneration.scheduleScreen,
        schedule: state.ScheduleGeneration.schedule
    };
}

export default connect(mapStateToProps, null)(MainPanel);