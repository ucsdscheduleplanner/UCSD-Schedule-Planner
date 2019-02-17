import React from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";

import "./InstructorPrefWidget.css";

import {Accordion} from "../../../../../../utils/accordion/Accordion";
import {AccordionBody, AccordionLabel, AccordionPanel} from "../../../../../../utils/accordion/AccordionPanel";
import {ReactComponent as PlusIcon} from "../../../../../../svg/icon-plus.svg";
import {HighlightButton} from "../../../../../../utils/button/highlight/HighlightButton";

export const InstructorPrefWidget = (props) => {
    const plusMinusNames = classNames("class-input__panel__part__body__header__icon", {"active": props.isOpen});
    let instructorButtons = props.instructors.map((instructor, index) => {
        return (
            <HighlightButton className="instructor-pref__button"
                             key={props.Class.classTitle + index.toString()}
                             onSelect={() => props.inputHandler.onInstructorChange(instructor)}
                             onDeselect={() => props.inputHandler.onInstructorChange(null)}
                             highlighted={props.Class.instructor === instructor}
                             value={instructor}/>
        );
    });

    instructorButtons = instructorButtons.length > 0 ? instructorButtons : [(<div> No instructors </div>)];

    return (
        <div className="class-input__panel__pref">
            <Accordion>
                <AccordionPanel label={props.Class.classTitle} {...props}>
                    <AccordionLabel>
                        <div className="class-input__panel__part__body__header">
                            <div/>
                            <div className="class-input__panel__part__body__header__title">
                                Instructor Preference
                            </div>
                            <div className={plusMinusNames}>
                                <PlusIcon/>
                            </div>
                        </div>
                    </AccordionLabel>
                    <AccordionBody>
                        <div className="instructor-pref__container">
                            {instructorButtons}
                        </div>
                    </AccordionBody>
                </AccordionPanel>
            </Accordion>
        </div>
    );
};

InstructorPrefWidget.propTypes = {
    instructors: PropTypes.array.isRequired
};
