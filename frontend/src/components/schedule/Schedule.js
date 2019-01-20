import React, {PureComponent} from 'react';
import {ReactComponent as ViewIcon} from "../../svg/icon-view.svg";
import "./Schedule.css";
import WeekCalendar from "./calendar/WeekCalendar";
import {ScheduleProgressBar} from "./progressbar/ScheduleProgressBar";


export class Schedule extends PureComponent {


    render() {
        let generationResult = this.props.generationResult;
        let schedule = generationResult.schedules.length > 0 ? generationResult.schedules[0] : [];
        console.log(this.props);
        const progressBar = (
            <ScheduleProgressBar
                generatingProgress={this.props.generatingProgress}
                totalNumPossibleSchedule={this.props.totalNumPossibleSchedule}/>
        );

        const calendar = (
            <WeekCalendar schedule={schedule}/>
        );

        return (
            <div className="schedule">
                <div className="schedule__header">
                    <div className="schedule__header__wrapper">
                        <ViewIcon/>
                        <span className="schedule__header__title">Schedule View</span>
                    </div>
                </div>

                <div className="schedule__body">
                    { this.props.generating ? progressBar : calendar }
                </div>
            </div>
        )

    }
}
