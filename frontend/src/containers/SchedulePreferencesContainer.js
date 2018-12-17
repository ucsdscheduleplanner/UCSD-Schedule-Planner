import {connect} from 'react-redux';
import React, {Component} from 'react';
import SchedulePreferences from "../components/landing/SchedulePreferences";
import {bindActionCreators} from "redux";
import {getSchedule} from "../actions/ScheduleGenerationActions";
import {addDayPreference, addEndPreference, addStartPreference} from "../actions/SchedulePreferencesActions";
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

            selectedClasses={this.props.selectedClasses}
            activated={this.props.sideBarActivated}

            activate={this.props.activate}
            deactivate={this.props.deactivate}
        />
    }
}

function mapStateToProps(state) {
    return {
        sideBarActivated: state.SchedulePreferences.sideBarActivated,
        selectedClasses: state.ClassSelection,
        startTimePreference: state.SchedulePreferences.startTimePreference,
        endTimePreference: state.SchedulePreferences.endTimePreference,
        dayPreference: state.SchedulePreferences.dayPreference
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSchedule: getSchedule,
        enterInputMode: enterInputMode,
        setDayPreference: addDayPreference,
        setStartTimePreference: addStartPreference,
        setEndTimePreference: addEndPreference,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePreferencesContainer);
