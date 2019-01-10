import React, {PureComponent} from 'react';
import {ClassInputPanelPartBody} from "./body/ClassInputPanelPartBody";
import {AccordionBody, AccordionLabel, AccordionPanel} from "../../../utils/accordion/AccordionPanel";

import {ReactComponent as EditIcon} from "../../../svg/icon-edit.svg";

import "./ClassInputPanel.css";
import ClassInputPanelPartHeaderContainer from "./header/ClassInputPanelPartHeaderContainer";
import {ControlledAccordion} from "../../../utils/accordion/ControlledAccordion";

export class ClassInputPanel extends PureComponent {

    render() {
        console.log(this.props.classList);
        const partList = Object.keys(this.props.classList).map(id => {
            const Class = this.props.classList[id];

            return (
                <ClassInputPanelPart key={id}
                    // just having a separate index so know which class to edit
                    // don't want to confuse myself with key
                                     transactionID={id}
                                     inputHandler={this.props.inputHandler}
                                     label={Class.classTitle}
                                     Class={Class}/>
            );
        });

        console.log(this.props.transactionID);
        const openSection = this.props.classList[this.props.transactionID] ? this.props.classList[this.props.transactionID].classTitle : null;

        return (
            <React.Fragment>
                <div className="class-input__panel__header">
                    <EditIcon height="1em" width="1em"/>
                    <span className="class-input__panel__header__title">Modify Course Information </span>
                </div>
                <div className="class-input__panel__body">
                    <ControlledAccordion openSection={openSection}>
                        {partList}
                    </ControlledAccordion>
                </div>
            </React.Fragment>
        )
    }
}

class ClassInputPanelPart extends PureComponent {

    render() {
        return (
            <React.Fragment>
                <AccordionPanel label={this.props.label} {...this.props}>
                    <AccordionLabel>
                        <ClassInputPanelPartHeaderContainer
                            title={this.props.Class.classTitle}
                            transactionID={this.props.transactionID}
                            inputHandler={this.props.inputHandler}
                            isOpen={this.props.isOpen}/>
                    </AccordionLabel>
                    <AccordionBody>
                        <ClassInputPanelPartBody
                            Class={this.props.Class}
                            isOpen={this.props.isOpen}
                            inputHandler={this.props.inputHandler}/>
                    </AccordionBody>
                </AccordionPanel>
            </React.Fragment>
        )
    }
}