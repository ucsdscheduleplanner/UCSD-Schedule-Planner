import {connect} from 'react-redux';
import React, {Component} from 'react';
import ScheduleOptions from "../landing/ScheduleOptions";
import {bindActionCreators} from "redux";
import {getSchedule} from "../actions/ScheduleGenerationActions";
import {enterInputMode} from "../actions/ClassInputActions";

class ScheduleOptionsContainer extends Component {
    // using class field syntax to get correct context binding
    getSchedule = () => {
        this.props.getSchedule(this.props.selectedClasses);
    };

    render() {
        return <ScheduleOptions
            getSchedule={this.getSchedule}
            enterInputMode={this.props.enterInputMode}

            calendarMode={this.props.calendarMode}
            selectedClasses={this.props.selectedClasses}
        />
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection,
        calendarMode: state.ScheduleGeneration.calendarMode
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSchedule: getSchedule,
        enterInputMode: enterInputMode,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleOptionsContainer);
