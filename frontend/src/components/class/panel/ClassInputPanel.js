import React, {PureComponent} from 'react';
import {ClassInputPanelPartHeader} from "./header/ClassInputPanelPartHeader";
import {ClassInputPanelPartBody} from "./body/ClassInputPanelPartBody";
import {Accordion} from "../../../utils/accordion/Accordion";
import {AccordionBody, AccordionLabel, AccordionPanel} from "../../../utils/accordion/AccordionPanel";

import "./ClassInputPanel.css";

export class ClassInputPanel extends PureComponent {

    render() {
        const partList = Object.keys(this.props.classList).map(index =>
            <ClassInputPanelPart key={index} label={index} currentClass={this.props.classList[index]}/>
        );

        return (

            <React.Fragment>
                <div className="class-input__panel__header"> Modify Course Information</div>
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
                        <ClassInputPanelPartHeader title={this.props.currentClass}/>
                    </AccordionLabel>
                    <AccordionBody>
                        <ClassInputPanelPartBody/>
                    </AccordionBody>
                </AccordionPanel>
            </React.Fragment>
        )
    }
}