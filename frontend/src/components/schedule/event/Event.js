import React from 'react';
import "./ClassEvent.css";
import {Button} from "../../../utils/button/Button";
import PropTypes from 'prop-types';

export class Event extends React.PureComponent {
    render() {
        return (
            <React.Fragment>
                <Button
                    label={this.props.getDisplayName()}
                    onClick={this.props.onClick}
                    onMouseEnter={this.props.onMouseEnter}
                    onMouseLeave={this.props.onMouseLeave}

                    className={this.props.className}
                />
            </React.Fragment>
        );
    }
}

Event.defaultProps = {
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    className: []
};

Event.propTypes = {
    className: PropTypes.array,
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    getDisplayName: PropTypes.func.isRequired,
};

