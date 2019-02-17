import React, {PureComponent} from 'react';
import WeekCalendar from "../calendar/WeekCalendar";

import PropTypes from "prop-types";
import {ScheduleProgressBar} from "../progressbar/ScheduleProgressBar";

export class ScheduleGenerator extends PureComponent {
    render() {
        const progressBar = (
            <ScheduleProgressBar
                generatingProgress={this.props.generatingProgress}
                totalNumPossibleSchedule={this.props.totalNumPossibleSchedule}/>
        );

        const calendar = (
            <WeekCalendar
                events={this.props.events}
            />
        );

        return (
            <React.Fragment>
                {this.props.generating ? progressBar : calendar}
            </React.Fragment>
        )
    }
}

ScheduleGenerator.propTypes = {
    events: PropTypes.array.isRequired,
    generatingProgress: PropTypes.number,
    totalNumPossibleSchedule: PropTypes.number,
    generating: PropTypes.bool,
};

