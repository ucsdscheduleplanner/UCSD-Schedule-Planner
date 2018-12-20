import React, {PureComponent} from 'react';
import {CSSTransition} from 'react-transition-group';
import "../css/Button.css";
import classNames from 'classnames';

export class Button extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            label: props.label,
            round: props.round,
            classNames: "custom-button ",
            id: this.props.id,
            disabled: this.props.disabled,
        };
        if(props.className) {
            this.state.classNames = this.state.classNames + " " + props.className;
        }

        if(this.state.round) {
            this.state.classNames = this.state.classNames + " custom-button__corner--round";
        }
        else {
            this.state.classNames = this.state.classNames + " custom-button__corner--default";
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.disabled !== this.props.disabled) {
            this.setState({
                disabled: this.props.disabled,
            })
        }
    }

    render() {
        return (
            <button disabled={this.state.disabled} id={this.state.id} className={this.state.classNames}
                    onClick={this.props.onClick}>
                {this.state.label}</button>
        );
    }
}