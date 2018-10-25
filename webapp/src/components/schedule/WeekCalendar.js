import React, {PureComponent} from "react";
import Calendar from "react-big-calendar";
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Button} from "primereact/components/button/Button";
import {ics} from "../../utils/ics";
import "../../css/WeekCalendar.css";
import {Slider} from "primereact/components/slider/Slider";

Calendar.setLocalizer(Calendar.momentLocalizer(moment));

class WeekCalendar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            scheduleIndex: 0,
            currentSchedule: null,
            subsections: [],
            events: [],
            hasSchedule: false,
        };

        console.log(props.generationResult);

        this.state.errors = props.generationResult.errors;
        console.log(props.generationResult.errors);
        this.state.hasError = Object.keys(this.state.errors).length > 0;

        if (this.state.hasError) {
            this.props.messageHandler.showError("Failed to generate generationResult", 1000);
            this.props.messageHandler.showError(this.getErrorMsg(), 3500);
        }

        this.state.hasSchedule = props.generationResult.schedules.length > 0 && !this.state.hasError;

        if(!this.state.hasSchedule)
            return;

        this.state.currentSchedule = props.generationResult.schedules[this.state.scheduleIndex];
        console.log(this.state.currentSchedule);
        this.state.subsections = this.flattenSchedule();
        this.state.events = this.initEvents();

    }

    flattenSchedule() {
        // generationResult should look like a 2D array where each element is a list of subsections
        let ret = [];
        for (let Class of this.state.currentSchedule.classes) {
            for (let subsection of Class) {
                ret.push(subsection);
            }
        }
        console.log(ret);
        return ret;
    }

    initEvents() {
        let ret = [];
        for (let subsection of this.state.subsections) {
            let startTime = subsection.timeInterval['start'];
            let endTime = subsection.timeInterval['end'];
            ret.push({
                start: startTime,
                end: endTime,
                title: `${subsection.classTitle} ${subsection.type}`
            });
        }
        console.log(ret);
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

        const dayFormat = {
            dayFormat: 'ddd'
        };

        let icsDownload = (
            <div className="ics-button">
                <Button label="Download Calendar" className="ui-button-info"
                        onClick={this.downloadICS.bind(this, this.state.subsections)}
                        disabled={this.props.generationResult.length === 0}/>
            </div>
        );

        let scheduleSlider = (
            <Slider value={this.state.scheduleIndex}
                    onChange={(e) => this.setState({scheduleIndex: e.value})}
            />
        );

        return (
            <div className="calendar-content">
                {this.state.hasSchedule && scheduleSlider}

                <Calendar
                    formats={dayFormat}
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


WeekCalendar.defaultProps = {
    generationResult: {
        schedules: [],
        errors: []
    }
};

export default WeekCalendar;