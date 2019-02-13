import React, {PureComponent} from 'react';
import {connect} from "react-redux";
import {ScheduleGenerator} from "./ScheduleGenerator";
import {bindActionCreators} from "redux";
import {getCleanClassData, getSchedule} from "../../../actions/schedule/generation/ScheduleGenerationActions";

class ScheduleGeneratorContainer extends PureComponent {

    componentDidUpdate(prevProps) {
        if (this.props.selectedClasses !== prevProps.selectedClasses) {
            this.props.getCleanClassData().then(() => {
                this.props.getSchedule();
            });
        }
    }


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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCleanClassData: getCleanClassData,
        getSchedule: getSchedule
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        currentSchedule: state.Schedule.currentSchedule,
        selectedClasses: state.ClassList.selectedClasses,

        generatingProgress: state.ScheduleGenerate.generatingProgress,
        totalNumPossibleSchedule: state.ScheduleGenerate.totalNumPossibleSchedule,
        generating: state.ScheduleGenerate.generating,
        classData: state.Schedule.classData,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleGeneratorContainer)

