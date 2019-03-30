import React from 'react';
import {Event} from "./Event";

import classNames from 'classnames';
import PropTypes from 'prop-types';
import "./TimeEvent.css";

export class TimeEvent extends React.PureComponent {

    getDisplayName() {
        return "Reserved";
    }

    render() {
        const names = classNames("time-button", {active: this.props.isSelected, shadowed: this.props.isShadowed});
        return (
            <Event
                getDisplayName={this.getDisplayName.bind(this)}
                onClick={this.props.onClick}
                className={names}
            />
        )
    }
}

TimeEvent.propTypes = {
    onClick: PropTypes.func.isRequired,
};
