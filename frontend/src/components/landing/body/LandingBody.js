import React, {PureComponent} from 'react';
import './LandingBody.css';
import ClassInputContainer from "../../class/input/ClassInputContainer";
import ScheduleContainer from "../../schedule/ScheduleContainer";

export class LandingBody extends PureComponent {
    render() {
        return (
            <div className="landing__body">
                <div className="landing__body--left">
                    <ClassInputContainer/>
                </div>
                <div className="landing__body--right">
                    <ScheduleContainer />
                </div>
            </div>
        );
    }
}
