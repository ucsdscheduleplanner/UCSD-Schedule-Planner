import React, {PureComponent} from 'react';
import {ClassInputPanelHeader} from "./header/ClassInputPanelHeader";
import {ClassInputPanelBody} from "./body/ClassInputPanelBody";
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

                <Accordion>
                    {partList}
                </Accordion>
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
                        <ClassInputPanelHeader title={this.props.currentClass}/>
                    </AccordionLabel>
                    <AccordionBody>
                        <ClassInputPanelBody/>
                    </AccordionBody>
                </AccordionPanel>
            </React.Fragment>
        )
    }
}