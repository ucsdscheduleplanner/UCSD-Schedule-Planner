import React, {PureComponent} from 'react';
import classNames from 'classnames';
import "./ClassEvent.css";
import {Button} from "../../../utils/button/Button";


export class ClassEvent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    getUserSelectedClass() {
        if (this.props.selectedClasses[this.props.transactionID])
            return this.props.selectedClasses[this.props.transactionID];
        else return null;
    }

    getTransactionIDForClass() {
        let classes = Object.values(this.props.selectedClasses);
        for (let i = 0; i < classes.length; i++) {
            if (classes[i].classTitle === this.props.classTitle)
                return classes[i].transactionID;
        }
        return null;
    }

    onClick() {
        let transactionID = this.getTransactionIDForClass();
        if (transactionID)
            this.props.toggleEditMode(transactionID);
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

        let isSelected = false;
        let userSelectedClass = this.getUserSelectedClass();
        if (userSelectedClass)
            isSelected = this.getUserSelectedClass().classTitle === classTitle;

        const names = classNames("ce-button", {active: isSelected});

        return (
            <Button label={classTitle} className={names} onClick={this.onClick.bind(this)}/>
        )
    }
}
