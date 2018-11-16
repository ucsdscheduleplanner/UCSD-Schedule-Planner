import React, {Component} from 'react';
import {Dialog} from 'primereact/components/dialog/Dialog';
import "../../css/ClassEvent.css";

export default class CustomEvent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    render() {
        const classTitle = `${this.props.event.classTitle} ${this.props.event.type}`;

        const courseID = `Course ID: ${this.props.event.courseID}`;
        const startTime = this.props.event.start.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const endTime = this.props.event.end.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const time = `Time: ${startTime} - ${endTime}`;
        const location = `Location: ${this.props.event.roomLocation} ${this.props.event.room}`;
        const instructor = `Instructor: ${this.props.event.instructor}`;

        return (
            <React.Fragment>
                <Dialog header={classTitle} visible={this.state.visible} width="350px" modal={true}
                        dismissableMask={true}
                        responsive={true}
                        minY={70} onHide={e => this.setState({visible: false})}
                        blockScroll={true}
                        className="ce-component">
                    <div>
                        <div className="ce-info">{courseID}</div>
                        <div className="ce-info">{instructor}</div>
                        <div className="ce-info">{location}</div>
                        <div className="ce-info">{time}</div>
                    </div>
                </Dialog>
                <button className="ce-button" onClick={e => this.setState({visible: true})}>
                    {classTitle}
                </button>
            </React.Fragment>
        )
    }
}