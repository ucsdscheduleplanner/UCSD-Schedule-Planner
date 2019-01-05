import React from 'react';
import "./AccordionPanel.css";
import classNames from 'classnames';

export const AccordionPanel = (props) => {
    const open = () => {
        props.open(props.label);
    };

    const children =  React.Children.map(props.children, (e) => {
            return React.cloneElement(e, {
                isOpen: props.isOpen,
                open: open.bind(this),
            });
        }
    );

    const names = classNames(['accordion__panel', {"active": props.isOpen}]);
    return (
        <div className={names}>{children}</div>
    )
};

export const AccordionLabel = (props) => {
    return (
        <div onClick={props.open} className="accordion__panel__label">
            {props.children}
        </div>
    );
};

export const AccordionBody = (props) => {
    const names = classNames(['accordion__panel__body', {active: props.isOpen}]);

    return (
        <div className={names}>
            {props.children}
        </div>
    );
};

