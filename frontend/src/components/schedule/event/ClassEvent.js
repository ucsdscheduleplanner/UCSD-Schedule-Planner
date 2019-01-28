import React, {PureComponent} from 'react';
import classNames from 'classnames';
import Popover, {ArrowContainer} from 'react-tiny-popover';
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

    onMouseEnter() {
        console.log("entering");
        this.setState({popOverOpen: true});
    }

    onMouseLeave() {
        this.setState({popOverOpen: false});
    }

    isSelected() {
        let userSelectedClass = this.getUserSelectedClass();
        if (userSelectedClass)
            return this.getUserSelectedClass().classTitle === this.props.classTitle;
        return null;
    }

    getInfoComponent() {
        const classTitle = this.props.classTitle;
        const courseID = `Course ID: ${this.props.id}`;

        const TIME_STR = "h:mm a";
        const range = this.props.range;
        let startTime = 'TBD';
        let endTime = 'TBD';

        if (range) {
            startTime = range.start.format(TIME_STR);
            endTime = range.end.format(TIME_STR);
        }

        const time = `Time: ${startTime} - ${endTime}`;
        const location = `Location: ${this.props.location} ${this.props.room}`;
        const instructor = `Instructor: ${this.props.instructor}`;

        return (
            <div className="ce-info__container">
                <div className="ce-info">
                    <div className="ce-info__title">
                        {classTitle}
                    </div>
                    <div>
                        {courseID}
                    </div>
                    <div>
                        {location}
                    </div>
                    <div>
                        {instructor}
                    </div>
                    <div>
                        {time}
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const isSelected = this.isSelected();
        const names = classNames("ce-button", {active: isSelected});

        return (
            <React.Fragment>
                <Popover
                    containerClassName="ce-popover"
                    isOpen={this.state.popOverOpen}
                    position={['right']}
                    transitionDuration={.25}
                    content={({position, targetRect, popoverRect}) => (
                        <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                            position={position}
                            targetRect={targetRect}
                            popoverRect={popoverRect}
                            arrowColor={'#182B49'}
                            arrowSize={20}
                        >
                            {this.getInfoComponent()}
                        </ArrowContainer>
                    )}
                >
                    <Button label={this.props.classTitle} className={names}
                            onMouseEnter={this.onMouseEnter.bind(this)}
                            onMouseLeave={this.onMouseLeave.bind(this)}
                            onClick={this.onClick.bind(this)}/>
                </Popover>
            </React.Fragment>
        );
    }
}
