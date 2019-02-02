import React, {Component} from 'react';
import {connect} from "react-redux";
import {Schedule} from "./Schedule";

class ScheduleContainer extends Component {
    render() {
        return (
            <Schedule {...this.props}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        generationResult: state.ScheduleGenerate.generationResult,
        generatingProgress: state.ScheduleGenerate.generatingProgress,
        totalNumPossibleSchedule: state.ScheduleGenerate.totalNumPossibleSchedule,
        generating: state.ScheduleGenerate.generating,
    }
}

export default connect(mapStateToProps)(ScheduleContainer)
