import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import "./ClassInputPanelPartBody.css"

import {ReactComponent as PlusIcon} from "../../../../svg/icon-plus.svg";
import {RemoveClassWidget} from "./widgets/remove_course/RemoveClassWidget";
import {ClassTypePrefWidget} from "./widgets/class_types/ClassTypePrefWidget";
import {InstructorPrefWidget} from "./widgets/instructor/InstructorPrefWidget";

export class ClassInputPanelPartBody extends PureComponent {

    render() {
        return (
            <div>
                <InstructorPrefWidget Class={this.props.Class} inputHandler={this.props.inputHandler} instructors={this.props.Class.instructors}/>
                <ClassInputPanelPartBodySection label={"CAPES"}/>
                <ClassTypePrefWidget Class={this.props.Class} inputHandler={this.props.inputHandler} types={this.props.Class.types}/>
                <ClassInputPanelPartBodySection label={"Course Description"}/>
                <RemoveClassWidget inputHandler={this.props.inputHandler}/>
            </div>
        )
    }
}

class ClassInputPanelPartBodySection extends PureComponent {
    // TODO use children as icons instead of just using plus here
    render() {
        const plusMinusNames = classNames("class-input__panel__part__body__header__icon", {"active": this.props.isOpen});

        return (
            <div className="class-input__panel__pref">
                <div className="class-input__panel__part__body__header">
                    <div/>
                    <div className="class-input__panel__part__body__header__title">
                        {this.props.label}
                    </div>
                    <div className={plusMinusNames}>
                        <PlusIcon/>
                    </div>
                </div>
            </div>
        );
    }
}

ClassInputPanelPartBodySection.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string.isRequired,
};





