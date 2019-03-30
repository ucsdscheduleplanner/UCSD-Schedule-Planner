import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Popover, {ArrowContainer} from 'react-tiny-popover';
import "./ClassEvent.css";
import {Event} from "./Event";


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
                            {this.props.getDisplayComponent()}
                        </ArrowContainer>
                    )}
                >
                    <Event
                        getDisplayName={this.getDisplayName.bind(this)}
                        className={names}
                        onMouseLeave={this.onMouseLeave.bind(this)}
                        onMouseEnter={this.onMouseEnter.bind(this)}
                        onClick={this.onClick.bind(this)}
                    />
                </Popover>
            </React.Fragment>
        );
    }
}

ClassEvent.propTypes = {
    getDisplayComponent: PropTypes.func.isRequired,
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
