import WeekCalendar from 'react-week-calendar';
import React, {Component} from 'react';
import moment from "moment";

export default class Calendar extends Component {

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
                    }).add('d', subclassStart.getDay()+1);

                    let newEnd = moment({
                        h: subclassEnd.getHours(),
                        m: subclassEnd.getMinutes()
                    }).add('d', subclassEnd.getDay()+1);

                    newInterval['start'] = newStart;
                    newInterval['end'] = newEnd;

                    newIntervals.push(newInterval);
                }
            }
        }
        this.state.selectedIntervals=newIntervals;
    }


    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            selectedIntervals: []
        };
        this.initIntervals(props.schedule);
    }

    render() {
        return (
            <WeekCalendar
                style={{zIndex: -1}}
                dayFormat="dd"
                startTime={moment({h: 8, m: 0})}
                endTime={moment({h: 21, m: 0})}
                scaleUnit="30"
                numberOfDays={7}
                selectedIntervals={this.state.selectedIntervals}
            />
        );
    }
}

