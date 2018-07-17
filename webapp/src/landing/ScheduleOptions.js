import React, {PureComponent} from 'react';
import '../css/ScheduleOptions.css'
import {Button} from "primereact/components/button/Button";
import {Sidebar} from "primereact/components/sidebar/Sidebar";


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

    render() {
        let activeButton;
        if (this.props.calendarMode) {
            activeButton = (
                <div className="schedule-options-return-planning" onClick={this.props.enterInputMode}>
                    <Button label="Return to Planning" style={{padding: "1em"}}/>
                </div>
            );
        } else {
            activeButton = (
                <div id="generate" className="schedule-options-generate"
                     onClick={this.props.getSchedule}>
                    <Button label="Generate" style={{padding: "1em"}}/>
                </div>
            );
        }

        return (
            <React.Fragment>
                <div className="schedule-options">
                    <div className="schedule-options-title"> Schedule Options</div>

                    <div className="schedule-options-content">
                        <div className="options-button">
                            <button className="class-button"
                                    onClick={(e) => this.setState({visible: true})}>
                                <i className="pi pi-angle-double-right"/>
                            </button>
                        </div>

                    </div>
                    {activeButton}
                    <Sidebar id="sidebar" visible={this.state.visible} position="right"
                             onHide={(e) => this.setState({visible: false})}>
                        <div className="schedule-options-sidebar">
                            <span className="schedule-options-title"> Schedule Options</span>
                        </div>
                    </Sidebar>
                </div>
            </React.Fragment>
        );
    }
}
