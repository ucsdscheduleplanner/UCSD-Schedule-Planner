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

        for(let Class of props.schedule) {
            for(let subclass of Class.subclassList) {
                let timeInterval = subclass.timeInterval;
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
                   title: `${Class.class_title} ${subclass.type}`
                });
            }
        }
    }

    replaceCodeWithName(str) {
        //return str.split(" ").map((element) => codeToClassType[element])
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
                    if(this.message && that.state.events.length === 0) {
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