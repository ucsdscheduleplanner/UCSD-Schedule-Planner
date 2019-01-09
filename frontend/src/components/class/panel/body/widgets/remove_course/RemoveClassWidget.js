import React from 'react';
import classNames from 'classnames';
import {ReactComponent as TrashIcon} from "../../../../../../svg/icon-trash.svg";

export const RemoveClassWidget = (props) => {
    const changeColorNames = classNames("class-input__panel__part__body__header__icon", {"active": props.isOpen});

    return (
        <div className="class-input__panel__pref clickable">
            <div className="class-input__panel__part__body__header" onClick={() => props.inputHandler.handleRemove()}>
                <div/>
                <div className="class-input__panel__part__body__header__title">
                    Remove Class
                </div>
                <div className={changeColorNames}>
                    <TrashIcon/>
                </div>
            </div>
        </div>
    );
};