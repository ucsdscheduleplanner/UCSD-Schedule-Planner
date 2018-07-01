import React, {PureComponent} from "react";
import Calendar from "react-big-calendar";
import moment from 'moment';
import "../css/WeekCalendar.css";

import "react-big-calendar/lib/css/react-big-calendar.css";
import {Growl} from "primereact/components/growl/Growl";

Calendar.setLocalizer(Calendar.momentLocalizer(moment));

class WeekCalendar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            events: []
        };

        // schedule should look like a 2D array where each element is a list of subsections
        let subsections = this.flattenSchedule(props.schedule);
        for (let subsection of subsections) {
            let startTime = subsection.timeInterval['start'];
            let endTime = subsection.timeInterval['end'];
            this.state.events.push({
                start: startTime,
                end: endTime,
                title: `${subsection.classTitle} ${subsection.type}`
            });
        }
    }

    flattenSchedule(schedule) {
        let ret = [];
        for (let Class of schedule) {
            for (let subsection of Class) {
                ret.push(subsection);
            }
        }
        return ret;
    }

    render() {
        let that = this;
        // setting max and min times
        const minTime = new Date();
        const maxTime = new Date();
        minTime.setHours(8, 0, 0);
        maxTime.setHours(23, 0, 0);

        return (
            <div className="calendar-content">
                <Growl ref={(el) => {
                    this.message = el;
                    if (this.message && that.state.events.length === 0) {
                        this.message.show({severity: "error", summary: "Failed to generate schedule.", life: 1000});
                    }
                }}/>
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