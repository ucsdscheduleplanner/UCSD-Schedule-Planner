import {connect} from 'react-redux';
import React, {Component} from 'react';
import SchedulePreferences from "../components/landing/SchedulePreferences";
import {bindActionCreators} from "redux";
import {getSchedule} from "../actions/ScheduleGenerationActions";
import {
    addDayPreference,
    addEndPreference,
    addStartPreference,
    toggleDisplayed
} from "../actions/SchedulePreferencesActions";
import {enterInputMode} from "../actions/ClassInputActions";

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

            displayed={this.props.displayed}
            selectedClasses={this.props.selectedClasses}
            toggleDisplayed={this.props.toggleDisplayed}
        />
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection,
        startTimePreference: state.SchedulePreferences.startTimePreference,
        endTimePreference: state.SchedulePreferences.endTimePreference,
        dayPreference: state.SchedulePreferences.dayPreference,
        displayed: state.SchedulePreferences.displayed
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSchedule: getSchedule,
        enterInputMode: enterInputMode,
        setDayPreference: addDayPreference,
        setStartTimePreference: addStartPreference,
        setEndTimePreference: addEndPreference,
        toggleDisplayed: toggleDisplayed
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePreferencesContainer);
