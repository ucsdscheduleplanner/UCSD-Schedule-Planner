/*
    This class will be the side panel where the user can alter
    the schedule options.
 */

import React, {Component} from 'react';
import "../css/RightSidePanel.css";
import ScheduleOptionsContainer from "../containers/ScheduleOptionsContainer";

export class RightSidePanel extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="right-side-panel">
                    <ScheduleOptionsContainer />
                </div>
            </React.Fragment>
        )
    }
}