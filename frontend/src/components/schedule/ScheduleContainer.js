import React, {Component} from 'react';
import {connect} from "react-redux";
import {Schedule} from "./Schedule";
import {bindActionCreators} from "redux";
import {setScheduleMode} from "../../actions/schedule/ScheduleActions";

class ScheduleContainer extends Component {
    render() {
        return (
            <Schedule
                scheduleMode={this.props.scheduleMode}
                setScheduleMode={this.props.setScheduleMode}
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
        scheduleMode: state.Schedule.scheduleMode,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleContainer)
