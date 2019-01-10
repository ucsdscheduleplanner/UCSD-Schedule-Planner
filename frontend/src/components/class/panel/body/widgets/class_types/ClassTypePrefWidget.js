import React from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";

import "./ClassTypePrefWidget.css";

import {Accordion} from "../../../../../../utils/accordion/Accordion";
import {AccordionBody, AccordionLabel, AccordionPanel} from "../../../../../../utils/accordion/AccordionPanel";
import {ReactComponent as PlusIcon} from "../../../../../../svg/icon-plus.svg";
import {ListBox} from "../../../../../../utils/listbox/ListBox";

export const ClassTypePrefWidget = (props) => {
    const plusMinusNames = classNames("class-input__panel__part__body__header__icon", {"active": props.isOpen});

    console.log(props);
    const listBox = props.types.length > 0 ? (
        <ListBox keyPrefix={props.Class.classTitle}
                 onClick={(selectedTypes) => {
                     console.log(selectedTypes);
                     props.inputHandler.onClassTypesToIgnoreChange(selectedTypes)
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

ClassTypePrefWidget.propTypes = {
    inputHandler: PropTypes.object.isRequired,
    types: PropTypes.array.isRequired
};