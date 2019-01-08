import React, {PureComponent} from 'react';
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
        if (this.props.onClick)
            this.props.onClick(evt);

        if(this.state.highlighted)
            this.setState({highlighted: false});
        else this.setState({highlighted: true});
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