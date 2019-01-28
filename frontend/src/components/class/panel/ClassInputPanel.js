import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Transition} from 'react-spring';

import {ClassInputPanelPartBody} from "./body/ClassInputPanelPartBody";
import {AccordionBody, AccordionLabel, AccordionPanel} from "../../../utils/accordion/AccordionPanel";

import {ReactComponent as EditIcon} from "../../../svg/icon-edit.svg";

import "./ClassInputPanel.css";
import ClassInputPanelPartHeaderContainer from "./header/ClassInputPanelPartHeaderContainer";

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
        const isOpen = openSection === Class.classTitle;
        return (
            <ClassInputPanelPart key={Class.transactionID}
                                 isOpen={isOpen}
                // just having a separate index so know which class to edit
                // don't want to confuse myself with key
                                 transactionID={Class.transactionID}
                                 inputHandler={this.props.inputHandler}
                                 label={Class.classTitle}
                                 Class={Class}/>
        )
    }

    getItems() {
        return Object.values(this.props.classList).length > 0 ?
            Object.values(this.props.classList) : [{"badProp": "hello", "transactionID": "world"}];
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
                        items={this.getItems()}
                        keys={Class => Class.transactionID}
                        config={this.config.bind(this)}
                        from={{opacity: 0}}
                        enter={{opacity: 1}}
                        leave={{opacity: 0}}>
                        {
                            // runs for each class and generates an accordion component
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

class ClassInputPanelPart extends PureComponent {
    render() {
        return (
            <AccordionPanel label={this.props.label} isOpen={this.props.isOpen}>
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
        );
    }
}

ClassInputPanelPart.propTypes = {
    Class: PropTypes.object.isRequired,
    inputHandler: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired
};
