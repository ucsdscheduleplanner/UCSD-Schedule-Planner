import React, {Component} from 'react';
import {connect} from 'react-redux';
import ClassList from "../components/landing/ClassList";
import {bindActionCreators} from "redux";
import {getSchedule} from "../actions/ScheduleGenerationActions";
import {setDisplayed} from "../actions/SchedulePreferencesActions";
import {enterEditMode, enterInputMode} from "../actions/ClassInputActions";

class ClassListContainer extends Component {

    render() {
        return <ClassList
            enterEditMode={this.props.enterEditMode}
            enterInputMode={this.props.enterInputMode}
            selectedClasses={this.props.selectedClasses}
            getSchedule={this.props.getSchedule}

            setDisplayed={this.props.setDisplayed}
            sideBarActivated={this.props.sideBarActivated}
        />
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection,
        sideBarActivated: state.SchedulePreferences.sideBarActivated
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setDisplayed: setDisplayed,

        getSchedule: getSchedule,
        enterEditMode: enterEditMode,
        enterInputMode: enterInputMode,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassListContainer);

