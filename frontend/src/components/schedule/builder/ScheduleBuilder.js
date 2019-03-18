import React, {PureComponent} from 'react';

import PropTypes from "prop-types";
import WeekCalendarContainer from "../calendar/WeekCalendarContainer";

export class ScheduleBuilder extends PureComponent {
    render() {
        const calendar = (
            <WeekCalendarContainer
                events={this.props.events}
            />
        );

        return (
            <React.Fragment>
                {calendar}
            </React.Fragment>
        )
    }
}

ScheduleBuilder.propTypes = {
    events: PropTypes.array.isRequired
};
