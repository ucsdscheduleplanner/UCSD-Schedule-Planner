import React, {PureComponent} from 'react';
import {Transition, config, animated} from 'react-spring';

import {ClassInputPanelPartBody} from "./body/ClassInputPanelPartBody";
import {AccordionBody, AccordionLabel, AccordionPanel} from "../../../utils/accordion/AccordionPanel";

import {ReactComponent as EditIcon} from "../../../svg/icon-edit.svg";

import "./ClassInputPanel.css";
import ClassInputPanelPartHeaderContainer from "./header/ClassInputPanelPartHeaderContainer";
import {ControlledAccordion} from "../../../utils/accordion/ControlledAccordion";
import {ClassInputPanelPartHeader} from "./header/ClassInputPanelPartHeader";

export class ClassInputPanel extends PureComponent {

    config(item, state) {
        return state === 'leave' ? {duration: 325} : undefined;
    }

    getEmptyValComponent() {
        return (
            <div className="class-input__panel__part__header__title">
                No classes entered
            </div>
        )
    }

    getClassAccordionComponent(Class, openSection) {
        return (<ControlledAccordion openSection={openSection}>
            <ClassInputPanelPart key={Class.transactionID}
                // just having a separate index so know which class to edit
                // don't want to confuse myself with key
                                 transactionID={Class.transactionID}
                                 inputHandler={this.props.inputHandler}
                                 label={Class.classTitle}
                                 Class={Class}/>
        </ControlledAccordion>)
    }

    render() {
        const openSection = this.props.classList[this.props.transactionID] ? this.props.classList[this.props.transactionID].classTitle : null;

        return (
            <React.Fragment>
                <div className="class-input__panel__header">
                    <EditIcon height="1em" width="1em"/>
                    <span className="class-input__panel__header__title">Modify Course Information </span>
                </div>
                <div className="class-input__panel__body">
                    <Transition
                        items={Object.values(this.props.classList).length > 0 ?
                            Object.values(this.props.classList) : [{"badProp": "hello", "transactionID": "world"}]}
                        keys={Class => Class.transactionID}

                        config={this.config.bind(this)}
                        from={{opacity: 0}}
                        enter={{opacity: 1}}
                        leave={{opacity: 0}}>
                        {
                            Class => props => {
                                // using a dummy object
                                if (Class.badProp) {
                                    return (
                                        <div style={props}>
                                            {this.getEmptyValComponent()}
                                        </div>
                                    );
                                }

                                return (
                                    <div style={props}>
                                        {this.getClassAccordionComponent(Class, openSection)}
                                    </div>
                                );
                            }
                        }
                    </Transition>
                </div>
            </React.Fragment>
        )
    }
}

class ClassInputPanelPart
    extends PureComponent {

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
