import WeekCalendar from 'react-week-calendar';
import React, {Component} from 'react';
//import '../css/utils.css';

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
                    });
                    newStart.day(subclassStart.getDay());

                    let newEnd = moment({
                        h: subclassEnd.getHours(),
                        m: subclassEnd.getMinutes()
                    });
                    newEnd.day(subclassEnd.getDay());

                    newInterval['start'] = newStart;
                    newInterval['end'] = newEnd;
                    newInterval['value'] = Subclass.toString();

                    newIntervals.push(newInterval);
                }
            }
        }
        this.setState({
            selectedIntervals: newIntervals
        });
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.schedule !== nextProps.schedule) {
            this.initIntervals(nextProps.schedule);
        }
    }

    render() {
        if (this.props.enabled) {
            return (
                <React.Fragment>
                    <WeekCalendar
                        firstDay={moment().day(1)}
                        dayFormat="dd"
                        startTime={moment({h: 8, m: 0})}
                        endTime={moment({h: 21, m: 0})}
                        scaleUnit="60"
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

