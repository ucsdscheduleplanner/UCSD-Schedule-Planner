import React, {PureComponent} from 'react';
import {ReactComponent as ViewIcon} from "../../svg/icon-view.svg";
import "./Schedule.css";
import WeekCalendar from "./WeekCalendar";


export class Schedule extends PureComponent {


    render() {
        let generationResult = this.props.generationResult;
        let schedule = generationResult.schedules.length > 0 ? generationResult.schedules[0]: [];

        return (
            <div className="schedule">
                <div className="schedule__header">
                    <div className="schedule__header__wrapper">
                        <ViewIcon/>
                        <span className="schedule__header__title">Schedule View</span>
                    </div>
                </div>

                <div className="schedule__body">
                    <WeekCalendar schedule={schedule}/>
                </div>
            </div>
        )

    }
}
