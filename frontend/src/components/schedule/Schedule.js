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
        else {
            this.props.setScheduleMode(BUILDER_MODE);
            this.props.messageHandler.showWarning("Warning: This mode is experimental, some features may be buggy.", 2500);
        }
    }

    getDisplayValue() {
        if (this.props.scheduleMode === BUILDER_MODE)
            return "Schedule Builder";
        else return "Schedule Generator";
    }

    getHelperMessage() {
        return (
            <em className="schedule-header__helper-text">Click on a class below or to the left to get started!</em>
        )
    }

    render() {
        return (
            <div className="schedule">
                <div className="schedule__header">
                    <div className="schedule__header__wrapper">
                        <div className="schedule-header__text">
                            <ViewIcon className="schedule-header__icon"/>
                            <div>
                                <span className="schedule__header__title">{this.getDisplayValue()}</span>
                                {
                                    this.props.scheduleMode === BUILDER_MODE && this.getHelperMessage()
                                }
                            </div>
                            <Toggle
                                className="schedule-header__button"
                                checked={this.isToggled()}
                                icons={false}
                                onChange={this.changeMode.bind(this)}/>
                        </div>
                    </div>
                </div>

                <div className="schedule__body">
                    {this.props.scheduleMode === BUILDER_MODE ? <ScheduleBuilderContainer/> :
                        <ScheduleGeneratorContainer/>}
                </div>
            </div>
        )

    }
}

Schedule.propTypes = {
    scheduleMode: PropTypes.string.isRequired,
    setScheduleMode: PropTypes.func.isRequired,
};
