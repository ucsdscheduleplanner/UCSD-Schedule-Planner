import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Button} from "../Button";
import "./HighlightButton.css";

export class HighlightButton extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            highlighted: false
        }
    }

    onClick(evt) {
        evt.preventDefault();
        if (this.state.highlighted) {
            this.setState({highlighted: false});
            this.props.onDeselect(this.props.label);
        } else {
            this.setState({highlighted: true});
            this.props.onSelect(this.props.label);
        }
    };

    render() {
        const names = classNames(this.props.className, "highlight-button", {"active": this.state.highlighted});
        // overriding onClick and className
        const props = Object.assign({}, this.props, {className: names, onClick: this.onClick.bind(this)});

        return (
            <Button {...props} />
        )
    }
}

HighlightButton.propTypes = {
    onSelect: PropTypes.func.isRequired,
    onDeselect: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
};