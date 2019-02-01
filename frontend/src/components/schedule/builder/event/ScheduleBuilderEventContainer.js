import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ClassEvent} from "../../event/ClassEvent";
import ClassUtils from "../../../../utils/class/ClassUtils";
import {enterEditMode, enterInputMode, toggleEditMode} from "../../../../actions/classinput/ClassInputActions";
import {setCurrentSchedule} from "../../../../actions/schedule/ScheduleActions";
import {setSectionNum} from "../../../../actions/schedule/builder/ScheduleBuilderActions";

class ScheduleBuilderEventContainer extends PureComponent {
    // TODO write test for this method
    // dictate what behavior is needed too
    isSelected() {
        let userSelectedClass = ClassUtils.getClassFor(this.props.transactionID, this.props.selectedClasses);
        if (userSelectedClass)
            return userSelectedClass.classTitle === this.props.classTitle &&
                // extra part about making sure the prop number is selected
                this.props.currentSchedule.includes(this.props.sectionNum);
        return false;
    }

    replaceSectionNumInSchedule() {
        // TODO put formatting in another method
        let classTitle = this.props.classTitle.replace(/\s+/g, '');
        let currentSchedule = this.props.currentSchedule.slice();
        currentSchedule = currentSchedule.filter(sectionNum => !sectionNum.startsWith(classTitle));
        currentSchedule.push(this.props.sectionNum);
        this.props.setCurrentSchedule(currentSchedule);
    }

    // TODO make sure that the section num changes on a click
    onClick() {
        let transactionID = ClassUtils.getTransactionIDForClass(this.props.classTitle, this.props.selectedClasses);

        if (!transactionID) {
            console.warn("Transaction ID is null for a class, how did that happen?");
            return;
        }

        if (this.props.transactionID !== transactionID) {
            this.props.enterEditMode(transactionID).then(() => {
                this.replaceSectionNumInSchedule();
                this.props.setCurrentSectionNum(this.props.sectionNum);
            });
            return;
        }

        if (this.props.currentSectionNum !== this.props.sectionNum) {
            this.replaceSectionNumInSchedule();
            this.props.setCurrentSectionNum(this.props.sectionNum);
        } else {
            // go back to input mode if we double clicked on the same class event
            this.props.enterInputMode();
            this.props.setCurrentSectionNum(null);
        }
    }

    render() {
        const isSelected = this.isSelected();
        return (
            <ClassEvent
                classTitle={this.props.classTitle}
                instructor={this.props.instructor}
                range={this.props.range}
                id={this.props.id}
                location={this.props.location}
                room={this.props.room}

                isSelected={isSelected}
                onClick={this.onClick.bind(this)}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        currentSectionNum: state.ScheduleBuilder.sectionNum,
        currentSchedule: state.Schedule.currentSchedule,
        selectedClasses: state.ClassList.selectedClasses,
        transactionID: state.ClassInput.transactionID
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        enterEditMode: enterEditMode,
        enterInputMode: enterInputMode,
        toggleEditMode: toggleEditMode,
        setCurrentSchedule: setCurrentSchedule,
        setCurrentSectionNum: setSectionNum
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleBuilderEventContainer);

ScheduleBuilderEventContainer.propTypes = {
    currentSchedule: PropTypes.array.isRequired,
    sectionNum: PropTypes.string.isRequired,
};
