import {connect} from 'react-redux';
import React, {Component} from 'react';
import ScheduleOptions from "../landing/ScheduleOptions";
import {bindActionCreators} from "redux";
import {getSchedule, returnToPlanning} from "../actions/ScheduleActions";

class ScheduleOptionsContainer extends Component {
    // using class field syntax to get correct context binding
    getSchedule = () => {
        this.props.getSchedule(this.props.selectedClasses);
    };

    render() {
        return <ScheduleOptions
            getSchedule={this.getSchedule}
            returnToPlanning={this.props.returnToPlanning}

            scheduleScreen={this.props.scheduleScreen}
            selectedClasses={this.props.selectedClasses}
        />
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection,
        scheduleScreen: state.ScheduleGeneration.scheduleScreen
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSchedule: getSchedule,
        returnToPlanning: returnToPlanning,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleOptionsContainer);
