import React, {Component} from 'react';
import {Circle} from 'rc-progress';
import "./ScheduleProgressBar.css";

export class ScheduleProgressBar extends Component {
    render() {
        console.log(this.props.generatingProgress / this.props.totalNumPossibleSchedule);
        return (
            <div className="schedule-progress-bar">
            <Circle percent={Math.round(100* this.props.generatingProgress / this.props.totalNumPossibleSchedule)}
                  strokeWidth="1"
                  strokeColor="green"/>
            </div>
        );
    }
}
