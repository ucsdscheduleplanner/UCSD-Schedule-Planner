import React, {PureComponent} from 'react';

import "./ClassInputPanelPartHeader.css";

export class ClassInputPanelPartHeader extends PureComponent {

    render() {
        return (
            <div className="class-input__panel__part__header">
                <div className="class-input__panel__part__header__icon">I</div>
                <div className="class-input__panel__part__header__title">
                    {this.props.title}
                </div>
                <div className="class-input__panel__part__header__icon">I</div>
            </div>
        )
    }
}