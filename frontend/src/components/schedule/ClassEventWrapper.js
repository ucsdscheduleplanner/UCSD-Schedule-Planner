import React, {PureComponent} from 'react';
import {Dialog} from 'primereact/components/dialog/Dialog';
import "./ClassEvent.css";
import Dayz from "dayz/dist/dayz";


class ClassEvent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
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
                <button className="ce-button" onClick={e => this.setState({visible: true})}>
                    {classTitle}
                </button>
            </React.Fragment>
        )
    }
}

export default class ClassEventWrapper extends Dayz.EventsCollection.Event {
    defaultRenderImplementation() {
        return (
            <ClassEvent {...this.attributes} />
        );
    }
}

