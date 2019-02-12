import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Button} from "../Button";
import "./HighlightButton.css";

export class HighlightButton extends PureComponent {
    onClick() {
        if (this.props.highlighted) {
            this.props.onDeselect(this.props.value);
        } else {
            this.props.onSelect(this.props.value);
        }
    };

    render() {
        const names = classNames(this.props.className, "highlight-button", {"active": this.props.highlighted});
        // overriding onClick and className
        const props = Object.assign({}, this.props, {className: names, onClick: this.onClick.bind(this)});

        return (
            <Button label={this.props.getDisplayValue(this.props.value)} {...props} />
        )
    }
}

HighlightButton.defaultProps = {
    getDisplayValue: (label) => label
};

HighlightButton.propTypes = {
    getDisplayValue: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    onDeselect: PropTypes.func.isRequired,
    highlighted: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
};
