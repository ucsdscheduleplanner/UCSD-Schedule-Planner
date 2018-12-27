import React, {PureComponent} from 'react';
import {ClassPanelHeader} from "./header/ClassPanelHeader";
import {Accordion} from "../../../../../storybook/src/components/Accordion";
import {AccordionBody, AccordionLabel} from "../../../../../storybook/src/components/AccordionPanel";
import {ClassPanelBody} from "./body/ClassPanelBody";

export class ClassPanel extends PureComponent {

    render() {
        return (
            <Accordion>
                <AccordionLabel>
                    <ClassPanelHeader/>
                </AccordionLabel>
                <AccordionBody>
                    <ClassPanelBody/>
                </AccordionBody>
            </Accordion>
        )
    }
}