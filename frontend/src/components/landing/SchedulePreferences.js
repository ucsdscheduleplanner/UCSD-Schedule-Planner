import React, {PureComponent} from 'react';
import '../../css/SchedulePreferences.css'
import {Sidebar} from "primereact/components/sidebar/Sidebar";
import {SelectButton} from "primereact/components/selectbutton/SelectButton";
import MediaQuery from 'react-responsive';

import 'rc-time-picker/assets/index.css';

import TimePicker from 'rc-time-picker';

/*
    This class should hold the UI for settings options for the generationResult.
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

        console.log(this.props.startTimePreference);

        const schedulePreferencesContent = (
            <div className="schedule-options-sidebar">
                <div className="schedule-options-title"> Schedule Preferences</div>
                <div className="time-preference">
                    <span className="time-preference-title">Time Preference:</span>

                    <div className="time-preference-start">
                        Start:
                        <TimePicker style={{width: "100%"}}
                                    value={this.props.startTimePreference}
                                    onChange={(e) => {
                                        console.log(e);
                                        this.props.setStartTimePreference(e)
                                    }}
                                    use12Hours={true}
                                    showSecond={false}/>
                    </div>

                    <div className="time-preference-end">
                        End:
                        <TimePicker use12Hours={true}
                                    value={this.props.endTimePreference}
                                    onChange={(e) => this.props.setEndTimePreference(e)}
                                    style={{width: "100%"}}
                                    showSecond={false}/>
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
                        <Sidebar id="sidebar"
                                 visible={this.props.activated}
                                 showCloseIcon={false}
                                 position={position}
                                 onHide={this.props.deactivate}>
                            {schedulePreferencesContent}
                        </Sidebar>
                    );
                }}
            </MediaQuery>
        );
    }
}