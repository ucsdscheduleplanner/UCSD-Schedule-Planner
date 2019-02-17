import React, {PureComponent} from 'react';
import WeekCalendar from "../calendar/WeekCalendar";

import PropTypes from "prop-types";

export class ScheduleBuilder extends PureComponent {
    render() {
        const calendar = (
            <WeekCalendar
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
