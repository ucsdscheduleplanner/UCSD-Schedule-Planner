import React, {Component} from 'react';
import {ProgressBar} from 'primereact/components/progressbar/ProgressBar';

export class ScheduleProgressBar extends Component {
    render() {
        return (
            <ProgressBar
                showValue={true}
                value={Math.round(100 * this.props.generatingProgress / this.props.totalNumPossibleSchedule)}/>
        )
    }
}
