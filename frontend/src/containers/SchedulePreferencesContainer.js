import {connect} from 'react-redux';
import React, {Component} from 'react';
import SchedulePreferences from "../components/landing/SchedulePreferences";
import {bindActionCreators} from "redux";
import {getSchedule} from "../actions/ScheduleGenerationActions";
import {enterInputMode} from "../actions/ClassInput/ClassInputActions";
import {setDayPref, setEndPref, setStartPref} from "../actions/SchedulePreference/SchedulePreferenceHandler";
import {setDisplayed, toggleDisplayed} from "../actions/SchedulePreference/SchedulePreferenceUIHandler";

class SchedulePreferencesContainer extends Component {
    // using class field syntax to get correct context binding
    getSchedule = () => {
        this.props.getSchedule(this.props.selectedClasses);
    };

    render() {
        return <SchedulePreferences
            getSchedule={this.getSchedule}
            enterInputMode={this.props.enterInputMode}

            setDayPref={this.props.setDayPref}
            setStartPref={this.props.setStartPref}
            setEndPref={this.props.setEndPref}

            startTimePreference={this.props.startTimePreference}
            endTimePreference={this.props.endTimePreference}
            dayPreference={this.props.dayPreference}

            displayed={this.props.displayed}
            selectedClasses={this.props.selectedClasses}
            setDisplayed={this.props.setDisplayed}
        />
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassList.selectedClasses,
        startTimePreference: state.Preferences.startTimePreference,
        endTimePreference: state.Preferences.endTimePreference,
        dayPreference: state.Preferences.dayPreference,
        displayed: state.Preferences.displayed
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSchedule: getSchedule,
        enterInputMode: enterInputMode,
        setDayPref: setDayPref,
        setStartPref: setStartPref,
        setEndPref: setEndPref,
        setDisplayed: setDisplayed,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePreferencesContainer);
