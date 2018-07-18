import React, {PureComponent} from 'react';
import '../css/ScheduleOptions.css'
import {Button} from "primereact/components/button/Button";
import {Sidebar} from "primereact/components/sidebar/Sidebar";
import {Calendar} from "primereact/components/calendar/Calendar";
import {SelectButton} from "primereact/components/selectbutton/SelectButton";

/*
    This class should hold the UI for settings options for the schedule.
 */
export default class ScheduleOptions extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            timeStart: null,
            timeEnd: null,
            daysSelected: null,
        }
    }

    toggleSideBar() {
        this.setState({visible: !this.state.visible});
    }

    render() {
        let activeButton;
        if (this.props.calendarMode) {
            activeButton = (
                <div id="return" className="schedule-options-return-planning" onClick={this.props.enterInputMode}>
                    <Button label="Return to Planning" style={{padding: "1em"}}/>
                </div>
            );
        } else {
            activeButton = (
                <React.Fragment>
                    <div className="schedule-options-button-holder">
                        <Button id="generate" onClick={this.props.getSchedule} label="Generate"
                                style={{padding: "1em"}}/>
                        <Button id="configure" onClick={this.toggleSideBar.bind(this)} label="Configure"/>
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

         const options = [
            {label: 'Apartment', value: 'Apartment'},
            {label: 'House', value: 'House'},
            {label: 'Studio', value: 'Studio'}
        ];

        const scheduleOptionsComponent = (
            <Sidebar id="sidebar" visible={this.state.visible} position="right"
                     onHide={(e) => this.setState({visible: false})}>
                <div className="schedule-options-sidebar">
                    <div className="schedule-options-title"> Schedule Options</div>
                    <div className="time-preference">
                        <span className="time-preference-title">Time Preference:</span>

                        <div className="time-preference-start">
                            Start:
                            <Calendar value={this.state.timeStart} hourFormat="12" timeOnly="true"
                                      onChange={(e) => this.setState({timeStart: e.value})}/>
                        </div>

                        <div className="time-preference-end">
                            End:
                            <Calendar value={this.state.timeEnd} hourFormat="12" timeOnly="true"
                                      onChange={(e) => this.setState({timeEnd: e.value})}/>
                        </div>
                    </div>
                    <div className="day-preference">
                        <span className="day-preference-title">Day Preference:</span>

                        <SelectButton value={this.state.daysSelected} multiple={true} options={days} onChange={(e) => this.setState({daysSelected: e.value})}/>
                    </div>
                </div>
            </Sidebar>
        );

        return (
            <div className="schedule-options-container-wrapper">
                <div className="schedule-options-container">
                    <div className="class-summary-title"> Class Information</div>
                    <div style={{'flex-grow': '1'}}>
                    </div>

                    <div>
                        {activeButton}
                    </div>
                    {scheduleOptionsComponent}
                </div>
            </div>
        )
        /*
                return (
                    <React.Fragment>
                            <div className="schedule-options">

                                <div className="schedule-options-content">
                                    <div className="options-button">
                                        <button className="class-button"
                                                onClick={(e) => this.setState({visible: true})}>
                                            <i className="pi pi-angle-double-right"/>
                                        </button>
                                    </div>

                                </div>
                                {activeButton}

                            </div>
                        </div>
                    </React.Fragment>
                );
                */
    }
}
