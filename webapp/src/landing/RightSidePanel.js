/*
    This class will be the side panel where the user can alter
    the schedule options.
 */

import React, {Component} from 'react';
import "../css/RightSidePanel.css";
import ClassInputContainer from "../containers/ClassInputContainer";
import connect from "react-redux/es/connect/connect";

class RightSidePanel extends Component {
    render() {
        return (
            <div className="rsp">
                <ClassInputContainer/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        messageHandler: state.ClassInput.messageHandler,
        generateSuccess: state.ScheduleGeneration.generateSuccess,
        generatingProgress: state.ScheduleGeneration.generatingProgress,
        generating: state.ScheduleGeneration.generating,
        calendarMode: state.ScheduleGeneration.calendarMode,
        schedule: state.ScheduleGeneration.schedule
    };
}

export default connect(mapStateToProps, null)(RightSidePanel);