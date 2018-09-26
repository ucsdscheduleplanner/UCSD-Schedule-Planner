import React, {PureComponent} from "react";
import Calendar from "react-big-calendar";
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Button} from "primereact/components/button/Button";
import {ics} from "../../utils/ics";
import "../../css/WeekCalendar.css";

Calendar.setLocalizer(Calendar.momentLocalizer(moment));

function setWidth() {
    let one = document.getElementsByClassName("rbc-time-gutter")[0];
    let two = document.getElementsByClassName("rbc-time-header-gutter")[0];
    let style = window.getComputedStyle(one);
    // super ugly but had to do it to keep everything consistent
    let width = parseInt(style.getPropertyValue('width'), 10) + 10 + "px";
    two.style.width = width;
    one.style.width = width;
}

class WeekCalendar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};

        this.state.subsections = this.flattenSchedule(props.schedule.classes);
        this.state.events = this.initEvents(this.state.subsections);

        // setting state if we got schedule errors, this component is remade every time
        // we make a new schedule so is ok to rebuild
        this.state.errors = props.schedule.errors;
        this.state.hasError = Object.keys(props.schedule.errors).length > 0;
        this.state.hasSchedule = this.state.events.length > 0 && !this.state.hasError;


        if (this.state.hasError) {
            this.props.messageHandler.showError("Failed to generate schedule", 1000);
            this.props.messageHandler.showError(this.getErrorMsg(), 3500);
        }

    }

    componentDidMount() {
        setWidth();
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

    getErrorMsg() {
        let errors = this.state.errors;
        let classWithMostConflicts = Object.keys(errors).reduce((key1, key2) => errors[key1].length > errors[key2].length ? key1 : key2);
        let conflicts = errors[classWithMostConflicts].join(", ");
        return `Failed to generate. Had the most trouble adding ${classWithMostConflicts}. During schedule generation, it 
        conflicted with ${conflicts}`
    }

    render() {
        // setting max and min times
        const minTime = new Date();
        const maxTime = new Date();
        minTime.setHours(8, 0, 0);
        maxTime.setHours(23, 0, 0);

        let icsDownload = (
            <div className="ics-button">
                <Button label="Download Calendar" className="ui-button-info"
                        onClick={this.downloadICS.bind(this, this.state.subsections)}
                        disabled={this.props.schedule.length === 0}/>
            </div>
        );

        return (
            <div className="calendar-content">
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

                {this.state.hasSchedule && icsDownload}
            </div>
        );
    }
}

export default WeekCalendar;