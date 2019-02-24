import React, {PureComponent} from 'react';
import {connect} from "react-redux";
import {ScheduleGenerator} from "./ScheduleGenerator";
import {bindActionCreators} from "redux";
import {getCleanClassData, getSchedule} from "../../../actions/schedule/generation/ScheduleGenerationActions";
import ClassUtils from "../../../utils/class/ClassUtils";
import ScheduleGeneratorEventWrapper from "./event/ScheduleGeneratorEventWrapper";

class ScheduleGeneratorContainer extends PureComponent {

    componentDidUpdate(prevProps) {
        if (this.props.selectedClasses !== prevProps.selectedClasses) {
            this.props.getCleanClassData().then(() => {
                this.props.getSchedule();
            });
        }
    }

    getDisplayedEventInfo(displayedSchedule) {
        return ClassUtils.getEventInfo(displayedSchedule, this.props.classData).filter((Class) => {
            let displayedClassTypes = this.props.viewClassTypeMapping[Class.title];

            if (displayedClassTypes && !displayedClassTypes.includes(Class.type))
                return false;

            return true;
        });
    }

    render() {
        const displayedEventsInfo = this.getDisplayedEventInfo(this.props.currentSchedule);
        const events = displayedEventsInfo.map(e => new ScheduleGeneratorEventWrapper(e));

        return (
            <ScheduleGenerator
                events={events}
                classData={this.props.classData}
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

        viewClassTypeMapping: state.ViewClassTypes.classMapping,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleGeneratorContainer)

