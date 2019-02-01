import React, {PureComponent} from 'react';
import {ReactComponent as ViewIcon} from "../../svg/icon-view.svg";
import "./Schedule.css";
import ScheduleGeneratorContainer from "./generator/ScheduleGeneratorContainer";
import ScheduleBuilderContainer from "./builder/ScheduleBuilderContainer";


export class Schedule extends PureComponent {
    render() {
        return (
            <div className="schedule">
                <div className="schedule__header">
                    <div className="schedule__header__wrapper">
                        <ViewIcon/>
                        <span className="schedule__header__title">Schedule View</span>
                    </div>
                </div>

                <div className="schedule__body">
                    <ScheduleBuilderContainer/>
                </div>
            </div>
        )

    }
}
