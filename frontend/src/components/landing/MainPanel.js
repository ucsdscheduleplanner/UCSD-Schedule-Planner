/*
    This class will hold the form for inputting classes.
 */

import React, {Component} from 'react';
import "../../css/MainPanel.css";
import {connect} from "react-redux";
import {ScheduleProgressBar} from "../schedule/ScheduleProgressBar";
import {ResultPanel} from "../schedule/ResultPanel";

class MainPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            priority: null,
            city: null,
            cities: null,
        };
    }

    render() {
        const calendar = (
            <ResultPanel
                key={this.props.scheduleKey}
                messageHandler={this.props.messageHandler}
                generationResult={this.props.generationResult}/>
        );

        const progressBar = (
            <ScheduleProgressBar
                generatingProgress={this.props.generatingProgress}
                totalNumPossibleSchedule={this.props.totalNumPossibleSchedule} />
        );

        return (
            <div className="main-panel">
                <div className="class-calendar">
                    <div className="title"> UCSD Schedule Planner</div>
                    { this.props.generating ? progressBar : calendar }
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        scheduleKey: state.ScheduleGeneration.scheduleKey,
        messageHandler: state.ClassInput.messageHandler,
        generateSuccess: state.ScheduleGeneration.generateSuccess,
        generatingProgress: state.ScheduleGeneration.generatingProgress,
        totalNumPossibleSchedule: state.ScheduleGeneration.totalNumPossibleSchedule,
        generating: state.ScheduleGeneration.generating,
        generationResult: state.ScheduleGeneration.generationResult
    };
}

export default connect(mapStateToProps, null)(MainPanel);
