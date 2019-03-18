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

    onEventClick(ev, event) {
        console.log("got clicked");
        console.log(ev);
        console.log(event);
    }

    onDayDoubleClick(event, date) {
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
                    onDayDoubleClick={this.onDayDoubleClick.bind(this)}
                    onEventClick={this.onEventClick.bind(this)}
                    date={relativeDate}
                    events={events} display="week" displayHours={[8, 23]}
                />
            </div>
        );
    }
}


WeekCalendar.defaultProps = {
    events: [],
    addTimePreference: () => {}
};

WeekCalendar.propTypes = {
    events: PropTypes.array.isRequired,
    addTimePreference: PropTypes.func
};

export default WeekCalendar;
