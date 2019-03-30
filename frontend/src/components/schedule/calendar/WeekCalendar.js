import React, {PureComponent} from "react";
import moment from 'moment';
import Dayz from "dayz/dist/dayz";

import "dayz/dist/css/dayz.min.css";
import "./WeekCalendar.css";
import PropTypes from 'prop-types';
import classNames from "classnames";
import {isSafari} from "../../../settings";


class WeekCalendar extends PureComponent {

    /**
     * Takes in classes and renders their sections and subsections
     * @returns {EventsCollection|*|EventsCollection|g}
     */
    createEvents() {
        return new Dayz.EventsCollection(this.props.events);
    }

    onEventResize(ev, event) {
        const start = event.start.format('hh:mma');
        const end = event.end.format('hh:mma');
        event.set({content: `${start} - ${end} (resizable)`});
    }

    onDayDoubleClick(event, date) {
        console.log("Adding reserved time!");
        const newRange = moment.range(date.clone(), date.clone().add(1, 'hour'));
        this.props.addTimePreference(newRange);
    }

    render() {
        const relativeDate = moment();
        const events = this.createEvents();
        const names = classNames("calendar", {safari: isSafari});

        return (
            <div className={names}>
                <Dayz
                    onEventResize={this.onEventResize.bind(this)}
                    onDayDoubleClick={this.onDayDoubleClick.bind(this)}
                    date={relativeDate}
                    events={events} display="week" displayHours={[8, 23]}
                />
            </div>
        );
    }
}


WeekCalendar.defaultProps = {
    events: [],
    addTimePreference: () => {
    }
};

WeekCalendar.propTypes = {
    events: PropTypes.array.isRequired,
    addTimePreference: PropTypes.func
};

export default WeekCalendar;
