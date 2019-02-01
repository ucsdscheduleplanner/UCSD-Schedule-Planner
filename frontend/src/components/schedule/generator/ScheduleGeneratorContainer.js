import React, {PureComponent} from 'react';
import {connect} from "react-redux";
import {ScheduleGenerator} from "./ScheduleGenerator";

class ScheduleGeneratorContainer extends PureComponent {
    render() {
        return (
            <ScheduleGenerator
                classData={this.props.classData}
                currentSchedule={this.props.currentSchedule}
                generatingProgress={this.props.generatingProgress}
                totalNumPossibleSchedule={this.props.totalNumPossibleSchedule}
                generating={this.props.generating}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        currentSchedule: state.Schedule.currentSchedule,

        generationResult: state.ScheduleGenerate.generationResult,
        generatingProgress: state.ScheduleGenerate.generatingProgress,
        totalNumPossibleSchedule: state.ScheduleGenerate.totalNumPossibleSchedule,
        generating: state.ScheduleGenerate.generating,
        classData: state.Schedule.classData,
    }
}

export default connect(mapStateToProps)(ScheduleGeneratorContainer)

