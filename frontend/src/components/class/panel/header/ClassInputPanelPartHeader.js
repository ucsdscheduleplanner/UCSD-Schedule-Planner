import React, {PureComponent} from 'react';
import classNames from 'classnames';

import "./ClassInputPanelPartHeader.css";

import {ReactComponent as BurgerIcon} from "../../../../svg/icon-menu.svg";
import {ReactComponent as PlusIcon} from "../../../../svg/icon-plus.svg";
import {ReactComponent as MinusIcon} from "../../../../svg/icon-minus.svg";

export class ClassInputPanelPartHeader extends PureComponent {

    render() {
        const plusMinusNames = classNames("class-input__panel__part__header__icon", {"active": this.props.isOpen});

        return (
            <div className="class-input__panel__part__header">
                <div className={plusMinusNames}>
                    <BurgerIcon/>
                </div>
                <div className="class-input__panel__part__header__title">
                    {this.props.title}
                </div>
                <div className={plusMinusNames}>
                    {
                        this.props.isOpen ? <MinusIcon/> : <PlusIcon/>
                    }
                </div>
            </div>
        )
    }
}