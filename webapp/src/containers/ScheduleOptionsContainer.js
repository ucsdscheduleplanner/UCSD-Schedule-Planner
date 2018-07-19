import {connect} from 'react-redux';
import React, {Component} from 'react';
import ScheduleOptions from "../landing/ScheduleOptions";
import {bindActionCreators} from "redux";
import {getSchedule} from "../actions/ScheduleGenerationActions";
import {enterInputMode} from "../actions/ClassInputActions";
import {
    setDayPreference, setEndTimePreference,
    setStartTimePreference
} from "../actions/ScheduleOptionsActions";

class ScheduleOptionsContainer extends Component {
    // using class field syntax to get correct context binding
    getSchedule = () => {
        this.props.getSchedule(this.props.selectedClasses);
    };

    render() {
        return <ScheduleOptions
            getSchedule={this.getSchedule}
            enterInputMode={this.props.enterInputMode}
            setDayPreference={this.props.setDayPreference}
            setStartTimePreference={this.props.setStartTimePreference}
            setEndTimePreference={this.props.setEndTimePreference}

            startTimePreference={this.props.startTimePreference}
            endTimePreference={this.props.endTimePreference}
            dayPreference={this.props.dayPreference}

            calendarMode={this.props.calendarMode}
            selectedClasses={this.props.selectedClasses}
        />
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection,
        calendarMode: state.ScheduleGeneration.calendarMode,
        startTimePreference: state.ScheduleOptions.startTimePreference,
        endTimePreference: state.ScheduleOptions.endTimePreference,
        dayPreference: state.ScheduleOptions.dayPreference
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSchedule: getSchedule,
        enterInputMode: enterInputMode,
        setDayPreference: setDayPreference,
        setStartTimePreference: setStartTimePreference,
        setEndTimePreference: setEndTimePreference,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleOptionsContainer);
