import React from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";

import "./ClassTypePrefWidget.css";

import {Accordion} from "../../../../../../utils/accordion/Accordion";
import {AccordionBody, AccordionLabel, AccordionPanel} from "../../../../../../utils/accordion/AccordionPanel";
import {ReactComponent as PlusIcon} from "../../../../../../svg/icon-plus.svg";
import {HighlightButton} from "../../../../../../utils/button/highlight/HighlightButton";

export const ClassTypePrefWidget = (props) => {
    const plusMinusNames = classNames("class-input__panel__part__body__header__icon", {"active": props.isOpen});
    let typeButtons = props.types.map((type, index) => {
        return (
            <HighlightButton className="type-pref__button"
                             key={props.Class.classTitle + index.toString()}
                             onClick={() => props.inputHandler.onClassTypesToIgnoreChange(type)}
                             label={type}/>
        );
    });

    typeButtons = typeButtons.length > 0 ? typeButtons : [(<div> No class types </div>)];

    return (
        <div className="class-input__panel__pref">
            <Accordion>
                <AccordionPanel label={props.label} {...props}>
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
                        <div className="type-pref__container">
                            {typeButtons}
                        </div>
                    </AccordionBody>
                </AccordionPanel>
            </Accordion>
        </div>
    );
};

ClassTypePrefWidget.propTypes = {
    inputHandler: PropTypes.object.isRequired,
    types: PropTypes.array.isRequired
};