import React, {Component} from 'react';
import {Dialog} from 'primereact/components/dialog/Dialog';
import {Button} from "../../../node_modules/primereact/components/button/Button";
import "../../css/ClassEvent.css";

export default class CustomEvent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    render() {
        console.log(this.props.event);
        const classTitle = `${this.props.event.classTitle} ${this.props.event.type}`;

        const courseID = `Course ID: ${this.props.event.courseID}`;
        const startTime = `Start Time: ${this.props.event.start.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}`;
        const endTime = `End Time: ${this.props.event.end.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}`;
        const location = `Location: ${this.props.event.roomLocation} ${this.props.event.room}`;
        const instructor = `Instructor: ${this.props.event.instructor}`;

        return (
            <React.Fragment>
                <Dialog header={classTitle} visible={this.state.visible} width="350px" modal={true}
                        dismissableMask={true}
                        minY={70} onHide={e => this.setState({visible: false})}
                        blockScroll={true}>
                    <div>
                        {courseID}
                    </div>
                    <div>
                        {instructor}
                    </div>
                    <div>
                        {location}
                    </div>
                    <div>
                        {startTime}
                    </div>
                    <div>
                        {endTime}
                    </div>
                </Dialog>
                <Button className="ce-component" label={classTitle} onClick={e => this.setState({visible: true})}/>
            </React.Fragment>
        )
    }
}