import React, {Component} from 'react';
import {CSSTransition} from 'react-transition-group';
import "../css/Button.css";
import classNames from "classnames";

export class Button extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: props.label,
            round: props.round,
            classNames: "custom-button",
        };
        if(props.className) {
            this.state.classNames = classNames(this.state.classNames, props.className);
        }

        if(this.state.round) {
            this.state.classNames = classNames(this.state.classNames, "custom-button__corner--round");
        }
        else {
            this.state.classNames = classNames(this.state.classNames, "custom-button__corner--default");
        }
    }

    render() {
        return (
            <button disabled={this.props.disabled} id={this.props.id} className={this.state.classNames}
                    onClick={this.props.onClick}>
                {this.state.label}</button>
        );
    }
}