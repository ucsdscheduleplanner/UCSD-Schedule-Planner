import React, {PureComponent} from 'react';
import WeekCalendar from "../calendar/WeekCalendar";

import PropTypes from "prop-types";
import ClassUtils from "../../../utils/class/ClassUtils";

export class ScheduleBuilder extends PureComponent {
    render() {
        const schedule = this.props.currentSchedule.map(sectionNum =>
            ClassUtils.buildClass(sectionNum, this.props.classData));

        const calendar = (
            <WeekCalendar schedule={schedule}/>
        );

        return (
            <React.Fragment>
                {calendar}
            </React.Fragment>
        )
    }
}

ScheduleBuilder.propTypes = {
    currentSchedule: PropTypes.array,
};
