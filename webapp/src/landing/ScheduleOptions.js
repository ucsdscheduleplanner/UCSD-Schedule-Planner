import React, {PureComponent} from 'react';
import '../css/ScheduleOptions.css'
import {AutoComplete} from "primereact/components/autocomplete/AutoComplete";
import {Button} from "primereact/components/button/Button";


/*
    This class should hold the UI for settings options for the schedule.
 */
export default class ScheduleOptions extends PureComponent {
    render() {
        let activeButton;
        if (this.props.calendarMode) {
            activeButton = (
                <div className="schedule-options-return-planning" onClick={this.props.exitCalendarMode}>
                    <Button label="Return to Planning" style={{padding: "1em"}}/>
                </div>
            );
        } else {
            activeButton = (
                <div className="schedule-options-generate"
                     onClick={this.props.getSchedule}>
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
                        <AutoComplete disabled={true} value={"Todo"}/>
                    </div>

                    <div className="form-field">
                        <div className="input-header"> Day Preference:</div>
                        <AutoComplete disabled={true} value={"Todo"}/>
                    </div>

                    {activeButton}
                </div>
            </React.Fragment>
        )
    }
}
