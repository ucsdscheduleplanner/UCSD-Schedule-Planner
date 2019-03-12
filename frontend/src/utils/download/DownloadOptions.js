import React, {PureComponent} from 'react';
import {ReactComponent as CalendarIcon} from "../../svg/icon-calendar.svg";
import PropTypes from 'prop-types';
import {addToCalendar} from "./GCalendar";
import {Button} from "../../utils/button/Button";
import Popover from 'react-tiny-popover';
import './DownloadOptions.css';

export class DownloadOptions extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            popOverOpen: false,
        }
    }

    onClick() {
        this.setState({popOverOpen: !this.state.popOverOpen});
    }

    showOptions() {
        return (
            <div className="options-list">
                <Button className="add-to-gcalendar-button" label="Google Calendar"
                        onClick={addToCalendar.bind(this, this.props.currentSchedule, this.props.classData)}/>
                <Button className="add-to-gcalendar-button" label="Outlook"/>
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                <Popover
                    containerClassName="download-options-popover"
                    isOpen={this.state.popOverOpen}
                    position={['bottom', 'left', 'top', 'right']}
                    transitionDuration={.25}
                    onClickOutside={() => this.setState({popOverOpen: false})}
                    content={() => (
                        <div>
                            {this.showOptions()}
                        </div>
                    )}
                >
                    <Button className="export-calendar-button" onClick={this.onClick.bind(this)}>
                        <CalendarIcon/>
                    </Button>
                </Popover>
            </React.Fragment>
        );
    }
}

DownloadOptions.propTypes = {
    classData: PropTypes.array.isRequired,
    currentSchedule: PropTypes.array.isRequired
};


