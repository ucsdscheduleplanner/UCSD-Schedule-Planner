import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import "./ClassInputPanelPartBody.css"

import {ReactComponent as PlusIcon} from "../../../../svg/icon-plus.svg";
import {ReactComponent as MinusIcon} from "../../../../svg/icon-minus.svg";
import {ReactComponent as TrashIcon} from "../../../../svg/icon-trash.svg";
import {AccordionBody, AccordionLabel, AccordionPanel} from "../../../../utils/accordion/AccordionPanel";
import {Accordion} from "../../../../utils/accordion/Accordion";

export class ClassInputPanelPartBody extends PureComponent {

    render() {
        return (
            <div>
                <InstructorPrefWidget/>
                <ClassInputPanelPartBodySection label={"CAPES"}/>
                <ClassInputPanelPartBodySection label={"View Class Types"}/>
                <ClassInputPanelPartBodySection label={"Course Description"}/>
                <RemoveCourseWidget />
            </div>
        )
    }
}

class ClassInputPanelPartBodySection extends PureComponent {
    // TODO use children as icons instead of just using plus here
    render() {
        const plusMinusNames = classNames("class-input__panel__part__body__header__icon", {"active": this.props.isOpen});

        return (
            <div className="class-input__panel__part__body__header">
                <div/>
                <div className="class-input__panel__part__body__header__title">
                    {this.props.label}
                </div>
                <div className={plusMinusNames}>
                    <PlusIcon/>
                </div>
            </div>
        );
    }
}

ClassInputPanelPartBodySection.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string.isRequired,
};


class InstructorPrefWidget extends PureComponent {
    render() {
        const plusMinusNames = classNames("class-input__panel__part__body__header__icon", {"active": this.props.isOpen});

        return (
            <div className="class-input__panel__part__body__instructor-pref">
                <Accordion>
                    <AccordionPanel label={this.props.label} {...this.props}>
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
                            <div style={{"margin": "1em"}}>
                                hello world
                            </div>
                        </AccordionBody>
                    </AccordionPanel>
                </Accordion>
            </div>
        );
    }
}

class RemoveCourseWidget extends PureComponent {
    render() {
        const changeColorNames = classNames("class-input__panel__part__body__header__icon", {"active": this.props.isOpen});

        return (
            <div className="class-input__panel__part__body__header">
                <div/>
                <div className="class-input__panel__part__body__header__title">
                    Remove Class
                </div>
                <div className={changeColorNames}>
                    <TrashIcon />
                </div>
            </div>
        );
    }
}
