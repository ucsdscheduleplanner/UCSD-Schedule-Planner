import React from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";

import "./ViewClassTypeWidget.css";

import {Accordion} from "../../../../../../../utils/accordion/Accordion";
import {AccordionBody, AccordionLabel, AccordionPanel} from "../../../../../../../utils/accordion/AccordionPanel";
import {ReactComponent as PlusIcon} from "../../../../../../../svg/icon-plus.svg";
import {ListBox} from "../../../../../../../utils/listbox/ListBox";


export const codeToClassType = {
    AC: 'Activity',
    CL: 'Clinical Clerkship',
    CO: 'Conference',
    DI: 'Discussion',
    FI: 'Final Exam',
    FM: 'Film',
    FW: 'Fieldwork',
    IN: 'Independent Study',
    IT: 'Internship',
    LA: 'Lab',
    LE: 'Lecture',
    MI: 'Midterm',
    MU: 'Make-up Session',
    OT: 'Other Additional Meeting',
    PB: 'Problem Session',
    PR: 'Practicum',
    RE: 'Review Session',
    SE: 'Seminar',
    ST: 'Studio',
    TU: 'Tutorial',
};


export const ViewClassTypeWidget = (props) => {
    const plusMinusNames = classNames("class-input__panel__part__body__header__icon", {"active": props.isOpen});

    const listBox = props.types.length > 0 ? (
        <ListBox
            isSelected={type => props.displayedClassTypes.includes(type)}
            className="type-pref__container"
            stylePerButton={["type-pref__button"]}
            keyPrefix={props.Class.classTitle}
            getDisplayValue={type => codeToClassType[type]}
            onClick={(selectedTypes) => {
                props.inputHandler.onViewClassTypes(selectedTypes)
            }}
            values={props.types}/>
    ) : (<div> No class types </div>);

    console.log(props.Class.classTitle);
    return (
        <div className="class-input__panel__pref">
            <Accordion>
                <AccordionPanel label={props.Class.classTitle} {...props}>
                    <AccordionLabel>
                        <div className="class-input__panel__part__body__header">
                            <div/>

                            <div className="class-input__panel__part__body__header__title">
                                View Class Types
                            </div>
                            <div className={plusMinusNames}>
                                <PlusIcon/>
                            </div>
                        </div>
                    </AccordionLabel>
                    <AccordionBody>
                        {listBox}
                    </AccordionBody>
                </AccordionPanel>
            </Accordion>
        </div>
    );
};

ViewClassTypeWidget.propTypes = {
    inputHandler: PropTypes.object.isRequired,
    types: PropTypes.array.isRequired,
    displayedClassTypes: PropTypes.array.isRequired
};
