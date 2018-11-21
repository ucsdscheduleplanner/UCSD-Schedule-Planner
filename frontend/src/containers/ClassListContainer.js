import React, {Component} from 'react';
import {connect} from 'react-redux';
import ClassList from "../components/landing/ClassList";
import {bindActionCreators} from "redux";
import {enterEditMode, enterInputMode, removeClass} from "../actions/ClassInputActions";
import {getSchedule} from "../actions/ScheduleGenerationActions";
import {activate, deactivate} from "../actions/SchedulePreferencesActions";

class ClassListContainer extends Component {

    render() {
        return <ClassList
            removeClass={this.props.removeClass}
            enterEditMode={this.props.enterEditMode}
            enterInputMode={this.props.enterInputMode}
            selectedClasses={this.props.selectedClasses}
            getSchedule={this.props.getSchedule}

            activateSchedulePreferences={this.props.activateSchedulePreferences}
            deactivateSchedulePreferences={this.props.deactivateSchedulePreferences}
            schedulePreferencesActivated={this.props.schedulePreferencesActivated}
        />
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection,
        schedulePreferencesActivated: state.SchedulePreferences.activated
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        activateSchedulePreferences: activate,
        deactivateSchedulePreferences: deactivate,

        getSchedule: getSchedule,
        removeClass: removeClass,
        enterEditMode: enterEditMode,
        enterInputMode: enterInputMode,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassListContainer);

