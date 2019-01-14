import React, {PureComponent} from "react";
import Calendar from "react-big-calendar";
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Button} from "primereact/components/button/Button";
import {ics} from "../../utils/download/ics";
import "../../css/WeekCalendar.css";
import ClassEvent from "./ClassEvent";
import {addEvents} from "../../utils/download/GCalendar";
import {TimeBuilder} from "../../utils/time/TimeUtils";
import Dayz from "dayz/dist/dayz";
import "dayz/dist/css/dayz.min.css";


Calendar.setLocalizer(Calendar.momentLocalizer(moment));


class WeekCalendar extends PureComponent {
    constructor(props) {
        super(props);
        // this.state = {
        //     subsections: [],
        //     events: [],
        //     schedule: null,
        // };

        const date = moment();
        this.state = {
            date,
            display: 'week',
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

        // this.state.schedule = this.props.schedule;
        // this.state.events = this.initEvents(this.props.schedule);
    }

    initEvents(schedule) {
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

                ret.push({
                    ...strippedClassData,
                    ...strippedSectionData,
                    ...subsection,
                    ...subsection.timeInterval
                });
            }
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
        // setting max and min times
        const minTime = new TimeBuilder().withHour(8).build();
        const maxTime = new TimeBuilder().withHour(23).build();

        const dayFormat = {
            dayFormat: 'ddd'
        };

        const icsDownload = (
            <Button id="ics-button"
                    label="Download Calendar" className="ui-button-info"
                    onClick={this.downloadICS.bind(this, this.state.subsections)}
                    disabled={this.props.empty}/>
        );
        const toGCalendar = (
            <Button id="gcalendar-button" label="Add to Google Calendar" className="ui-button-info"
                    onClick={addEvents.bind(this, this.state.subsections)}
                    disabled={this.props.empty}/>
        );
        const components = {
            event: ClassEvent
        };

        return (
            <Dayz
                {...this.state}
                displayHours={[8, 21]}
            />
        );
    }
}


WeekCalendar.defaultProps = {
    schedule: [],
};

export default WeekCalendar;


let COUNT = 1;

class DayzTestComponent extends React.Component {

    constructor(props) {
        super(props);
        this.addEvent = this.addEvent.bind(this);
        this.onEventClick = this.onEventClick.bind(this);
        this.editComponent = this.editComponent.bind(this);
        this.changeDisplay = this.changeDisplay.bind(this);
        this.onEventResize = this.onEventResize.bind(this);
        const date = moment('2015-09-11');
        this.state = {
            date,
            display: 'week',
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

    changeDisplay(ev) {
        this.setState({display: ev.target.value});
    }

    onEventClick(ev, event) {
        event.set({editing: !event.isEditing()});
    }

    onEventResize(ev, event) {
        const start = event.start.format('hh:mma');
        const end = event.end.format('hh:mma');
        event.set({content: `${start} - ${end} (resizable)`});
    }

    addEvent(ev, date) {
        this.state.events.add({
            content: `Event ${COUNT++}`,
            resizable: true,
            range: moment.range(date.clone(), date.clone()
                .add(1, 'hour')
                .add(45, 'minutes')),
        });
    }

    editComponent(props) {
        const onBlur = function () {
            props.event.set({editing: false});
        };
        const onChange = function (ev) {
            props.event.set({content: ev.target.value});
        };
        const onDelete = function () {
            props.event.remove();
        };
        return (
            <div className="edit">
                <input
                    type="text" autoFocus
                    value={props.event.content}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                <button onClick={onDelete}>X</button>
            </div>
        );
    }

    render() {
        return (
            <div className="dayz-test-wrapper">

                <div className="tools">
                    <label>
                        Month: <input type="radio"
                                      name="style" value="month" onChange={this.changeDisplay}
                                      checked={'month' === this.state.display}/>
                    </label><label>
                    Week: <input type="radio"
                                 name="style" value="week" onChange={this.changeDisplay}
                                 checked={'week' === this.state.display}/>
                </label><label>
                    Day: <input type="radio"
                                name="style" value="day" onChange={this.changeDisplay}
                                checked={'day' === this.state.display}/>
                </label>
                </div>

                <Dayz {...this.state}
                      date={moment()}
                      displayHours={[8, 22]}
                      onEventResize={this.onEventResize}
                      editComponent={this.editComponent}
                      onDayDoubleClick={this.addEvent}
                >
                </Dayz>
            </div>
        );
    }

}

