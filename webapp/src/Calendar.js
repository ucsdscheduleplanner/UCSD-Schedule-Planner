import WeekCalendar from 'react-week-calendar';
import React, {Component} from 'react';
import {
    Button
} from 'semantic-ui-react';

import moment from "moment";

export default class Calendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            enabled: props.enabled,
            id: 0,
            selectedIntervals: []
        };
    }

    initIntervals(schedule) {
        let newIntervals = [];
        for (let Class of schedule) {
            for (let SubclassType of Object.values(Class.subclasses)) {
                for (let Subclass of SubclassType) {
                    let newInterval = {};
                    newInterval['uid'] = this.state.id++;

                    let subclassStart = Subclass.timeInterval.start;
                    let subclassEnd = Subclass.timeInterval.end;

                    let newStart = moment({
                        h: subclassStart.getHours(),
                        m: subclassStart.getMinutes()
                    }).add('d', subclassStart.getDay() + 1);

                    let newEnd = moment({
                        h: subclassEnd.getHours(),
                        m: subclassEnd.getMinutes()
                    }).add('d', subclassEnd.getDay() + 1);

                    newInterval['start'] = newStart;
                    newInterval['end'] = newEnd;
                    newInterval['value'] = Subclass.toString();

                    newIntervals.push(newInterval);
                }
            }
        }
        this.state.selectedIntervals = newIntervals;
    }

    render() {
        let that = this;
        if (this.props.enabled) {
            this.initIntervals(this.props.schedule);
            return (
                <React.Fragment>
                    <WeekCalendar
                        style={{zIndex: -1}}
                        dayFormat="dd"
                        startTime={moment({h: 8, m: 0})}
                        endTime={moment({h: 21, m: 0})}
                        scaleUnit="30"
                        numberOfDays={7}
                        selectedIntervals={this.state.selectedIntervals}
                    />
                    <Button negative floated="right"
                            onClick={this.props.clearSchedule}
                            content="Clear Schedule"/>
                </React.Fragment>
            );
        } else return null;
    }
}

