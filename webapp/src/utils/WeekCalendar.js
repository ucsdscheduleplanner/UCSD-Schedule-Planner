import React, {PureComponent} from "react";
import Calendar from "react-big-calendar";
import moment from 'moment';
import "../css/WeekCalendar.css";

import "react-big-calendar/lib/css/react-big-calendar.css";
import {Growl} from "primereact/components/growl/Growl";
import {Button} from "primereact/components/button/Button";
import {ics} from "../utils/ics";

Calendar.setLocalizer(Calendar.momentLocalizer(moment));

class WeekCalendar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};

        this.state.subsections = this.flattenSchedule(props.schedule);
        this.state.events = this.initEvents(this.state.subsections);
    }

    flattenSchedule(schedule) {
        // schedule should look like a 2D array where each element is a list of subsections
        let ret = [];
        for (let Class of schedule) {
            for (let subsection of Class) {
                ret.push(subsection);
            }
        }
        return ret;
    }

    initEvents(subsections) {
        let ret = [];
        for (let subsection of subsections) {
            let startTime = subsection.timeInterval['start'];
            let endTime = subsection.timeInterval['end'];
            ret.push({
                start: startTime,
                end: endTime,
                title: `${subsection.classTitle} ${subsection.type}`
            });
        }
        return ret;
    }

    downloadICS(subsections) {
        let calendar = ics();
        for (let subsection of subsections) {
            let fiveWeeksAhead = new Date();
            // setting five weeks ahead
            fiveWeeksAhead.setDate(fiveWeeksAhead.getDate() + 35);
            let recurringEventRule = {
                freq: "WEEKLY",
                until: fiveWeeksAhead,
                interval: 1,
                byday: [subsection.day]
            };

            calendar.addEvent(
                subsection.classTitle,
                subsection.description,
                subsection.location,
                subsection.timeInterval['start'],
                subsection.timeInterval['end'],
                recurringEventRule
            )
        }
        calendar.download("Calendar");
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
                    id="calendar"
                    min={minTime}
                    max={maxTime}
                    toolbar={false}
                    defaultDate={new Date()}
                    defaultView={'work_week'}
                    views={['work_week']}
                    events={this.state.events}
                />
                <div className="ics-button">
                    <Button label="Download Calendar" className="ui-button-info"
                            onClick={this.downloadICS.bind(this, this.state.subsections)}
                            disabled={this.props.schedule.length === 0}/>
                </div>
            </div>
        );
    }
}

export default WeekCalendar;