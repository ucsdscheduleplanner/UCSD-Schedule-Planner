import React, {PureComponent} from 'react';
import '../css/ScheduleOptions.css'
import {Button} from "primereact/components/button/Button";
import {Sidebar} from "primereact/components/sidebar/Sidebar";
import {Calendar} from "primereact/components/calendar/Calendar";
import {SelectButton} from "primereact/components/selectbutton/SelectButton";
import MediaQuery from 'react-responsive';

/*
    This class should hold the UI for settings options for the schedule.
 */
export default class ScheduleOptions extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    toggleSideBar() {
        this.setState({visible: !this.state.visible});
    }

    getSchedule() {
        this.props.getSchedule();
        this.toggleSideBar();
    }

    render() {
        let activeButton;
        if (this.props.calendarMode) {
            activeButton = (
                <div id="return">
                    <Button label="Return to Planning" style={{padding: "1em"}}
                            onClick={this.props.enterInputMode}/>
                </div>
            );
        } else {
            activeButton = (
                <React.Fragment>
                    <div>
                        <Button id="configure" style={{padding: "1em"}} onClick={this.toggleSideBar.bind(this)}
                                label="Configure and Generate"/>
                    </div>
                </React.Fragment>
            );
        }

        const days = [
            {label: 'M', value: 'M'},
            {label: 'Tu', value: 'Tu'},
            {label: 'W', value: 'W'},
            {label: 'Th', value: 'Th'},
            {label: 'F', value: 'F'}
        ];

        const scheduleOptionsContent = (
            <div className="schedule-options-sidebar">
                <div className="schedule-options-title"> Schedule Options</div>
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

                <Button id="generate" onClick={this.getSchedule.bind(this)} label="Generate"
                        style={{padding: "1em"}}/>
            </div>
        );

        const scheduleOptionsComponent = (
            <MediaQuery query="(max-width: 525px)">
                {(matches) => {
                    let position;
                    if (matches) {
                        position = "bottom";

                    } else {
                        position = "right";
                    }
                    return (
                        <Sidebar id="sidebar" visible={this.state.visible} position={position}
                                 onHide={(e) => this.setState({visible: false})}>
                            {scheduleOptionsContent}
                        </Sidebar>
                    );
                }}
            </MediaQuery>
        );

        return (
            <div className="schedule-options-container-wrapper">
                <div className="schedule-options-container">
                    <div className="class-summary-title"> Class Information</div>
                    <div className="capes-info-text">
                        This space will contain data from CAPES in the future. <br/><br/> Please be patient as I work on
                        this.
                    </div>

                    {activeButton}
                    {scheduleOptionsComponent}
                </div>
            </div>
        )
    }
}
