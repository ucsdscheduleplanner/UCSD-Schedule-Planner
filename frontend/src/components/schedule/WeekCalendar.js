import React, {PureComponent} from "react";
import Calendar from "react-big-calendar";
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Dayz from "dayz/dist/dayz";
import "dayz/dist/css/dayz.min.css";
import "./WeekCalendar.css";
import ClassEventWrapper from "./ClassEventWrapper";


Calendar.setLocalizer(Calendar.momentLocalizer(moment));


class WeekCalendar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            events: new Dayz.EventsCollection([
                {
                    content: '9am - 2pm (resizable)',
                    resizable: {step: 15},
                    range: moment.range(moment('2019-01-14')
                            .hour(9),
                        moment('2019-01-14')
                            .hour(14)),
                },
                {
                    content: '10am - 10:50am (bad)',
                    range: moment.range(moment('2019-01-15')
                            .hour(10),
                        moment('2019-01-15')
                            .hour(10)
                            .minute(50)
                    ),
                },

                {
                    content: '8am - 8pm (non-resizable)',
                    range: moment.range(moment('2015-09-07')
                            .hour(8),
                        moment('2015-09-07')
                            .hour(21)
                            .minutes(40)),
                },
            ]),
        };
    }

    convertToRange(timeInterval) {
        if (timeInterval === null)
            return null;
        let start = timeInterval.start;
        let end = timeInterval.end;

        if (start && end) {
            start = moment(start);
            end = moment(end);
        } else {
            console.warn("Start or end are not valid");
            console.warn(start);
            console.warn(end);
        }

        return moment.range(start, end);
    }

    createEvents(schedule) {
        let ret = [];
        for (let Class of schedule) {
            if (Class.sections.length === 0)
                continue;

            if (Class.sections.length > 1)
                console.warn(`Bad things have happened and the Class ${Class.classTitle} has more than one section`)

            const section = Class.sections[0];
            for (let subsection of section.subsections) {
                let strippedClassData = Object.assign({}, Class, {sections: []});
                let strippedSectionData = Object.assign({}, section, {subsections: []});

                let timeRange = this.convertToRange(subsection.timeInterval);

                ret.push(
                    new ClassEventWrapper({
                        content: strippedSectionData.classTitle,
                        ...strippedClassData,
                        ...strippedSectionData,
                        ...subsection,
                        range: timeRange
                    })
                );
            }
        }
        return new Dayz.EventsCollection(ret);
    }

    onEventClick(ev, event) {
        console.log("got clicked");
        console.log(ev);
        console.log(event);
    }

    render() {
        const relativeDate = moment();
        const events = this.createEvents(this.props.schedule);

        console.log(events);

        return (
            <div className="calendar">
                <Dayz
                    onEventClick={this.onEventClick.bind(this)}
                    date={relativeDate}
                    events={events}
                    display="week"
                    displayHours={[8, 21]}
                />
            </div>
        );
    }
}


WeekCalendar.defaultProps = {
    schedule: [],
};

export default WeekCalendar;

