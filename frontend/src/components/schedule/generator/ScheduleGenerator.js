import React, {PureComponent} from 'react';
import WeekCalendar from "../calendar/WeekCalendar";

import PropTypes from "prop-types";
import {ScheduleProgressBar} from "../progressbar/ScheduleProgressBar";
import ClassUtils from "../../../utils/class/ClassUtils";
import ScheduleGeneratorEventCollection from "./event/ScheduleGeneratorEventCollection";

export class ScheduleGenerator extends PureComponent {
    render() {
        const progressBar = (
            <ScheduleProgressBar
                generatingProgress={this.props.generatingProgress}
                totalNumPossibleSchedule={this.props.totalNumPossibleSchedule}/>
        );

        const schedule = this.props.currentSchedule.map(sectionNum =>
            ClassUtils.buildClass(sectionNum, this.props.classData));

        const calendar = (
            <WeekCalendar
                getCollection={(events) => new ScheduleGeneratorEventCollection(events)}
                schedule={schedule}/>
        );

        return (
            <React.Fragment>
                {this.props.generating ? progressBar : calendar}
            </React.Fragment>
        )
    }
}

ScheduleGenerator.propTypes = {
    currentSchedule: PropTypes.array,
    generatingProgress: PropTypes.number,
    totalNumPossibleSchedule: PropTypes.number,
    generating: PropTypes.bool
};

