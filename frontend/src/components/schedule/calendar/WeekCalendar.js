import React, {PureComponent} from "react";
import moment from 'moment';
import Dayz from "dayz/dist/dayz";

import "dayz/dist/css/dayz.min.css";
import "./WeekCalendar.css";
import PropTypes from 'prop-types';


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

    render() {
        const relativeDate = moment();
        const events = this.createEvents();

        return (
            <div className="calendar">
                <Dayz
                    onEventClick={this.onEventClick.bind(this)}
                    date={relativeDate}
                    events={events}
                    display="week"
                    displayHours={[8, 23]}
                />
            </div>
        );
    }
}


WeekCalendar.defaultProps = {
    events: [],
};

WeekCalendar.propTypes = {
    events: PropTypes.array.isRequired,
};

export default WeekCalendar;

