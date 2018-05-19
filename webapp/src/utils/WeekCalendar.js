import React, {PureComponent} from "react";
import Calendar from "react-big-calendar";
import moment from 'moment';
import "../css/WeekCalendar.css";

import "react-big-calendar/lib/css/react-big-calendar.css";

Calendar.setLocalizer(Calendar.momentLocalizer(moment));

class WeekCalendar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        };

        for(let Class of props.schedule) {
            for(let timeInterval of Class.timeIntervals) {
                let startTime = new Date();
                let endTime = new Date();

                let backendStart = timeInterval["start"];
                let backendEnd = timeInterval["end"];

                let currentDay = startTime.getDay();
                let dist = backendStart.getDay() - currentDay;
                startTime.setDate(startTime.getDate() + dist);
                dist = backendEnd.getDay() - currentDay;
                endTime.setDate(endTime.getDate() + dist);

                startTime.setHours(backendStart.getHours(), backendStart.getMinutes(), backendStart.getSeconds());
                endTime.setHours(backendEnd.getHours(), backendEnd.getMinutes(), backendEnd.getSeconds());

                this.state.events.push({
                   start: startTime,
                   end: endTime,
                   title: Class.name
                });
            }
        }
    }

    render() {
        // setting max and min times
        const minTime = new Date();
        const maxTime = new Date();
        minTime.setHours(8, 0, 0);
        maxTime.setHours(23, 0, 0);

        return (
            <div className="calendar-content">
                <Calendar
                    min={minTime}
                    max={maxTime}
                    toolbar={false}
                    defaultDate={new Date()}
                    defaultView={'work_week'}
                    views={['work_week']}
                    events={this.state.events}
                />
            </div>
        );
    }
}

export default WeekCalendar;