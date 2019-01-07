import React from 'react';
import classNames from "classnames";
import "./Button.css";

export const Button = (props) => {
    const names = classNames(
        props.className,
        "custom-button",
        "custom-button__corner--default",
        {"custom-button__corner--round": props.round}
    );

    return (
        <button disabled={props.disabled} id={props.id} className={names}
                onClick={props.onClick}>
            {props.label}
        </button>
    );
};