/*
    This class will be the side panel where the user can alter
    the schedule options.
 */

import React, {Component} from 'react';
import ScheduleOptions from './ScheduleOptions';
import "../css/RightSidePanel.css";

export class RightSidePanel extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="right-side-panel">
                    <ScheduleOptions />
                </div>
            </React.Fragment>
        )
    }
}