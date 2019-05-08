import {connect} from 'react-redux';
import React, {Component} from 'react';
import SchedulePreferences from "../components/landing/SchedulePreferences";
import {bindActionCreators} from "redux";
import {enterInputMode} from "../actions/classinput/ClassInputActions";
import {setDayPref, setEndPref, setStartPref} from "../actions/preference/schedule/SchedulePreferenceMutator";
import {setDisplayed} from "../actions/preference/schedule/SchedulePreferenceUIHandler";
import {getSchedulePreferenceInputHandler} from "../actions/preference/schedule/SchedulePreferenceInputHandler";

class SchedulePreferencesContainer extends Component {

    constructor(props) {
        super(props);
        this.inputHandler = this.props.getInputHandler();
    }

    render() {
        return <SchedulePreferences
            enterInputMode={this.props.enterInputMode}
            inputHandler={this.inputHandler}

            setDayPref={this.props.setDayPref}
            setStartPref={this.props.setStartPref}
            setEndPref={this.props.setEndPref}

            startPref={this.props.startPref}
            endPref={this.props.endPref}
            dayPref={this.props.dayPref}

            displayed={this.props.displayed}
            setDisplayed={this.props.setDisplayed}
        />
    }
}

function mapStateToProps(state) {
    return {
        startPref: state.SchedulePreferences.startPref,
        endPref: state.SchedulePreferences.endPref,
        dayPref: state.SchedulePreferences.dayPref,
        displayed: state.SchedulePreferences.displayed
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        enterInputMode: enterInputMode,
        setDayPref: setDayPref,
        setStartPref: setStartPref,
        setEndPref: setEndPref,
        setDisplayed: setDisplayed,
        getInputHandler: getSchedulePreferenceInputHandler
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePreferencesContainer);
