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
                key={this.props.scheduleID}
                messageHandler={this.props.messageHandler}
                generationResult={this.props.generationResult}/>
        );

        console.log(this.props);
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
        scheduleID: state.ScheduleGenerate.scheduleID,
        messageHandler: state.ClassInput.messageHandler,
        generateSuccess: state.ScheduleGenerate.generateSuccess,
        generatingProgress: state.ScheduleGenerate.generatingProgress,
        totalNumPossibleSchedule: state.ScheduleGenerate.totalNumPossibleSchedule,
        generating: state.ScheduleGenerate.generating,
        generationResult: state.ScheduleGenerate.generationResult
    };
}

export default connect(mapStateToProps, null)(MainPanel);
