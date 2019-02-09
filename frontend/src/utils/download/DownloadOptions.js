import React, {PureComponent} from 'react';
import {addEvents} from "./GCalendar";
import {Button} from "../../utils/button/Button";
import Popover, {ArrowContainer} from 'react-tiny-popover';
import './DownloadOptions.css';

export class DownloadOptions extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            popOverOpen: false,
        }
    }

    onClick() {
        if(!this.state.popOverOpen) {
            this.setState({popOverOpen: true})
        } else {
            this.setState({popOverOpen: false});
        }
    }

    showOptions() {
        return (
            <div className="export-calendar__container">
                <Button className="add-to-gcalendar-button" round={true} label="Add to Google Calendar"
                        onClick={addEvents.bind(this, this.props.schedule)}/>
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                <Popover
                    containerClassName="download-options-popover"
                    isOpen={this.state.popOverOpen}
                    position={['left','bottom','top','right']}
                    transitionDuration={.25}
                    onClickOutside={() => this.setState({ popOverOpen: false })}
                    content={({position, targetRect, popoverRect}) => (
                        <ArrowContainer
                            position={position}
                            targetRect={targetRect}
                            popoverRect={popoverRect}
                            arrowColor={'#7A7A7A'}
                            arrowSize={20}
                        >
                            {this.showOptions()}
                        </ArrowContainer>
                    )}
                >
                    <Button className="export-calendar-button" label="Export Calendar"
                            round={true} onClick={this.onClick.bind(this)}/>
                </Popover>
            </React.Fragment>
        );
    }
}
