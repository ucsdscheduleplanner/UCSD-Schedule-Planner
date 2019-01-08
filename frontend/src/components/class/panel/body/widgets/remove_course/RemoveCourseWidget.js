import React from 'react';
import classNames from 'classnames';
import {ReactComponent as TrashIcon} from "../../../../../../svg/icon-trash.svg";

export const RemoveCourseWidget = (props) => {
    const changeColorNames = classNames("class-input__panel__part__body__header__icon", {"active": props.isOpen});

    return (
        <div className="class-input__panel__pref">
            <div className="class-input__panel__part__body__header">
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