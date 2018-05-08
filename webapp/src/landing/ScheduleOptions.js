import React, {Component} from 'react';
import '../css/ScheduleOptions.css'
import {AutoComplete} from "primereact/components/autocomplete/AutoComplete";
import {Button} from "primereact/components/button/Button";
import {getSchedule, returnToPlanning} from "../actions/scheduleActions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";


/*
    This class should hold the UI for settings options for the schedule.

 */
class ScheduleOptions extends Component {

    getSchedule() {
        this.props.getSchedule(this.props.selectedClasses);
    }

    returnToPlanning() {
        this.props.returnToPlanning();
    }

    render() {
        let activeButton;
        if (this.props.scheduleScreen) {
            activeButton = (
                <div className="schedule-options-return-planning" onClick={this.returnToPlanning.bind(this)}>
                    <Button label="Return to Planning" style={{padding: "1em"}}/>
                </div>
            );
        } else {
            activeButton = (
                <div className="schedule-options-generate" onClick={this.getSchedule.bind(this)}>
                    <Button label="Generate" style={{padding: "1em"}}/>
                </div>
            );
        }

        return (
            <React.Fragment>
                <div className="schedule-options">
                    <div className="schedule-options-title"> Schedule Options</div>
                </div>

                <div className="schedule-options-content">
                    <div className="form-field">
                        <div className="input-header"> Time Preference:</div>
                        <AutoComplete value={"Coming soon!"}/>
                    </div>

                    <div className="form-field">
                        <div className="input-header"> Day Preference:</div>
                        <AutoComplete value={"Coming soon!"}/>
                    </div>

                    {activeButton}
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection,
        scheduleScreen: state.ScheduleGeneration.scheduleScreen
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getSchedule: getSchedule,
        returnToPlanning: returnToPlanning,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleOptions);
