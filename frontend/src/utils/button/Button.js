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
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}
                onClick={props.onClick}>
            {props.label}
            {props.children}
        </button>
    );
};

Button.defaultProps = {
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {}
};
