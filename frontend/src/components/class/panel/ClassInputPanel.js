import React, {PureComponent} from 'react';
import {ClassInputPanelPartHeader} from "./header/ClassInputPanelPartHeader";
import {ClassInputPanelPartBody} from "./body/ClassInputPanelPartBody";
import {Accordion} from "../../../utils/accordion/Accordion";
import {AccordionBody, AccordionLabel, AccordionPanel} from "../../../utils/accordion/AccordionPanel";

import {ReactComponent as EditIcon} from "../../../svg/icon-edit.svg";

import "./ClassInputPanel.css";

export class ClassInputPanel extends PureComponent {

    render() {
        const partList = Object.keys(this.props.classList).map(index =>
            <ClassInputPanelPart key={index} label={index} currentClass={this.props.classList[index]}/>
        );

        return (

            <React.Fragment>
                <div className="class-input__panel__header">
                    <EditIcon height="1em" width="1em"/>
                    <span className="class-input__panel__header__title">Modify Course Information </span>
                </div>
                <div className="class-input__panel__body">
                    <Accordion>
                        {partList}
                    </Accordion>
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
                        <ClassInputPanelPartHeader title={this.props.currentClass} isOpen={this.props.isOpen}/>
                    </AccordionLabel>
                    <AccordionBody>
                        <ClassInputPanelPartBody isOpen={this.props.isOpen}/>
                    </AccordionBody>
                </AccordionPanel>
            </React.Fragment>
        )
    }
}