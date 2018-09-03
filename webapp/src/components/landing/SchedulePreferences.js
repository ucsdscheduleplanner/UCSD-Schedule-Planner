import React, {PureComponent} from 'react';
import '../../css/SchedulePreferences.css'
import {Button} from "primereact/components/button/Button";
import {Sidebar} from "primereact/components/sidebar/Sidebar";
import {Calendar} from "primereact/components/calendar/Calendar";
import {SelectButton} from "primereact/components/selectbutton/SelectButton";
import MediaQuery from 'react-responsive';

/*
    This class should hold the UI for settings options for the schedule.
 */
export default class SchedulePreferences extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    render() {
        const days = [
            {label: 'M', value: 'M'},
            {label: 'Tu', value: 'Tu'},
            {label: 'W', value: 'W'},
            {label: 'Th', value: 'Th'},
            {label: 'F', value: 'F'}
        ];

        const schedulePreferencesContent = (
            <div className="schedule-options-sidebar">
                <div className="schedule-options-title"> Schedule Preferences </div>
                <div className="time-preference">
                    <span className="time-preference-title">Time Preference:</span>

                    <div className="time-preference-start">
                        Start:
                        <Calendar value={this.props.startTimePreference} hourFormat="12" showTime={true} timeOnly={true}
                                  onChange={(e) => this.props.setStartTimePreference(e.value)}/>
                    </div>

                    <div className="time-preference-end">
                        End:
                        <Calendar value={this.props.endTimePreference} hourFormat="12" showTime={true} timeOnly={true}
                                  onChange={(e) => {
                                      this.props.setEndTimePreference(e.value)
                                  }}/>
                    </div>
                </div>
                <div className="day-preference">
                    <span className="day-preference-title">Day Preference:</span>

                    <SelectButton id="day-preference" value={this.props.dayPreference} multiple={true} options={days}
                                  onChange={(e) => this.props.setDayPreference(e.value)}/>
                </div>
            </div>
        );

        return (
            <MediaQuery query="(max-width: 700px)">
                {(matches) => {
                    let position;
                    if (matches) {
                        position = "bottom";

                    } else {
                        position = "left";
                    }
                    return (
                        <Sidebar id="sidebar" visible={this.props.activated} position={position}
                                 onHide={this.props.deactivate}>
                            {schedulePreferencesContent}
                        </Sidebar>
                    );
                }}
            </MediaQuery>
        );
    }
}
