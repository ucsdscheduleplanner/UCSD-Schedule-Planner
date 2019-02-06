import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Popover, {ArrowContainer} from 'react-tiny-popover';
import "./ClassEvent.css";
import {Button} from "../../../utils/button/Button";
import {codeToClassType} from "../../class/panel/body/widgets/class_types/ClassTypePrefWidget";


export class ClassEvent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    onClick() {
        this.props.onClick();
        this.setState({popOverOpen: false});
    }

    onMouseEnter() {
        this.setState({popOverOpen: true});
    }

    onMouseLeave() {
        this.setState({popOverOpen: false});
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

        let formattedType = codeToClassType[this.props.type];
        const type = formattedType ?formattedType: "";
        const title = `${classTitle} ${type}`;

        return (
            <div className="ce-info__container">
                <div className="ce-info">
                    <div className="ce-info__title">
                        {title}
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

    getDisplayName() {
        return `${this.props.classTitle} ${this.props.type}`;
    }

    render() {
        const names = classNames("ce-button", {active: this.props.isSelected, shadowed: this.props.isShadowed});

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
                    <Button label={this.getDisplayName()} className={names}
                            onMouseEnter={this.onMouseEnter.bind(this)}
                            onMouseLeave={this.onMouseLeave.bind(this)}
                            onClick={this.onClick.bind(this)}/>
                </Popover>
            </React.Fragment>
        );
    }
}

ClassEvent.propTypes = {
    classTitle: PropTypes.string.isRequired,
    instructor: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    range: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    room: PropTypes.string.isRequired,

    isSelected: PropTypes.bool.isRequired,
    isShadowed: PropTypes.bool,
    onClick: PropTypes.func
};
