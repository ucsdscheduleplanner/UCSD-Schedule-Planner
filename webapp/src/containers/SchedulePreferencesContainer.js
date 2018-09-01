import {connect} from 'react-redux';
import React, {Component} from 'react';
import SchedulePreferences from "../landing/SchedulePreferences";
import {bindActionCreators} from "redux";
import {getSchedule} from "../actions/ScheduleGenerationActions";
import {enterInputMode} from "../actions/ClassInputActions";
import {
    activate, deactivate,
    setDayPreference, setEndTimePreference,
    setStartTimePreference
} from "../actions/SchedulePreferencesActions";

class SchedulePreferencesContainer extends Component {
    // using class field syntax to get correct context binding
    getSchedule = () => {
        this.props.getSchedule(this.props.selectedClasses);
    };

    render() {
        return <SchedulePreferences
            getSchedule={this.getSchedule}
            enterInputMode={this.props.enterInputMode}
            setDayPreference={this.props.setDayPreference}
            setStartTimePreference={this.props.setStartTimePreference}
            setEndTimePreference={this.props.setEndTimePreference}

            startTimePreference={this.props.startTimePreference}
            endTimePreference={this.props.endTimePreference}
            dayPreference={this.props.dayPreference}

            selectedClasses={this.props.selectedClasses}
            activated={this.props.activated}

            activate={this.props.activate}
            deactivate={this.props.deactivate}
        />
    }
}

function mapStateToProps(state) {
    return {
        activated: state.SchedulePreferences.activated,
        selectedClasses: state.ClassSelection,
        startTimePreference: state.SchedulePreferences.startTimePreference,
        endTimePreference: state.SchedulePreferences.endTimePreference,
        dayPreference: state.SchedulePreferences.dayPreference
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        activate: activate,
        deactivate: deactivate,

        getSchedule: getSchedule,
        enterInputMode: enterInputMode,
        setDayPreference: setDayPreference,
        setStartTimePreference: setStartTimePreference,
        setEndTimePreference: setEndTimePreference,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePreferencesContainer);
