import React, {Component} from 'react';
import {connect} from "react-redux";
import {Schedule} from "./Schedule";
import {bindActionCreators} from "redux";
import {setScheduleMode} from "../../actions/schedule/ScheduleActions";

class ScheduleContainer extends Component {
    render() {
        return (
            <Schedule
                currentSchedule={this.props.currentSchedule}
                scheduleMode={this.props.scheduleMode}
                setScheduleMode={this.props.setScheduleMode}

                messageHandler={this.props.messageHandler}
            />
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setScheduleMode: setScheduleMode
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        currentSchedule: state.Schedule.currentSchedule,
        scheduleMode: state.Schedule.scheduleMode,
        messageHandler: state.ClassInput.messageHandler,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleContainer)
