import React, {PureComponent} from 'react';
import {Dialog} from 'primereact/components/dialog/Dialog';
import classNames from 'classnames';
import "./ClassEvent.css";


export class ClassEvent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    getCurrentClassTitle() {
        if(this.props.selectedClasses[this.props.transactionID])
            return this.props.selectedClasses[this.props.transactionID].classTitle;
        else return null;
    }

    render() {
        const classTitle = this.props.classTitle;
        const courseID = `Course ID: ${this.props.id}`;
        // const startTime = this.attributes.start.toLocaleTimeString('en-US', {
        //     hour: '2-digit',
        //     minute: '2-digit',
        //     hour12: true
        // });
        //
        // const endTime = this.attributes.end.toLocaleTimeString('en-US', {
        //     hour: '2-digit',
        //     minute: '2-digit',
        //     hour12: true
        // });

        //const time = `Time: ${startTime} - ${endTime}`;
        const location = `Location: ${this.props.location} ${this.props.room}`;
        const instructor = `Instructor: ${this.props.instructor}`;


        const isSelected = this.getCurrentClassTitle() === classTitle;
        const names = classNames("ce-button", {active: isSelected});

        return (
            <React.Fragment>
                <Dialog header={classTitle} visible={this.state.visible} width="350px"
                        draggable={true}
                        dismissableMask={true}
                        responsive={true}
                        closeOnEscape={true}
                        minY={70} onHide={e => this.setState({visible: false})}
                        blockScroll={true}
                        className="ce-component">
                    <div>
                        <div className="ce-info">{courseID}</div>
                        <div className="ce-info">{instructor}</div>
                        <div className="ce-info">{location}</div>
                        {/*<div className="ce-info">{time}</div>*/}
                    </div>
                </Dialog>
                <button className={names} onClick={e => this.setState({visible: true})}>
                    {classTitle}
                </button>
            </React.Fragment>
        )
    }
}
