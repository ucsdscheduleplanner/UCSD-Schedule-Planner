import React, {PureComponent} from 'react';
import {ReactComponent as ViewIcon} from "../../svg/icon-view.svg";
import ScheduleGeneratorContainer from "./generator/ScheduleGeneratorContainer";
import Toggle from 'react-toggle';
import "./Schedule.css";

import ScheduleBuilderContainer from "./builder/ScheduleBuilderContainer";
import {BUILDER_MODE, GENERATOR_MODE} from "../../reducers/ScheduleReducer";
import PropTypes from 'prop-types';


export class Schedule extends PureComponent {

    /**
     * Method for toggle component (or whatever will replace it in the future)
     *
     * Let it be toggled in builder mode for now
     */
    isToggled() {
        return this.props.scheduleMode === BUILDER_MODE;
    }

    changeMode() {
        if (this.props.scheduleMode === BUILDER_MODE)
            this.props.setScheduleMode(GENERATOR_MODE);
        else
            this.props.setScheduleMode(BUILDER_MODE);
    }

    getDisplayValue() {
        if(this.props.scheduleMode === BUILDER_MODE)
            return "Schedule Builder";
        else return "Schedule Generator";
    }

    render() {
        return (
            <div className="schedule">
                <div className="schedule__header">
                    <div className="schedule__header__wrapper">
                        <div className="schedule-header__text">
                            <ViewIcon/>
                            <span className="schedule__header__title">Schedule View</span>
                        </div>
                        <div className="schedule-header__button">
                            <Toggle
                                checked={this.isToggled()}
                                icons={false}
                                onChange={this.changeMode.bind(this)}/>
                            <span className="schedule-header__toggle-text">{this.getDisplayValue()}</span>
                        </div>
                    </div>
                </div>

                <div className="schedule__body">
                    {this.props.scheduleMode === BUILDER_MODE ? <ScheduleBuilderContainer/> : <ScheduleGeneratorContainer/>}
                </div>
            </div>
        )

    }
}

Schedule.propTypes = {
    scheduleMode: PropTypes.string.isRequired,
    setScheduleMode: PropTypes.func.isRequired,
};
