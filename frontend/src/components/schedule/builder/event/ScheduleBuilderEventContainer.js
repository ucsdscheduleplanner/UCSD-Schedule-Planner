import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ClassEvent} from "../../event/ClassEvent";
import ClassUtils from "../../../../utils/class/ClassUtils";
import {enterEditMode, enterInputMode, toggleEditMode} from "../../../../actions/classinput/ClassInputActions";
import {setCurrentSchedule} from "../../../../actions/schedule/ScheduleActions";
import {setSectionNum} from "../../../../actions/schedule/builder/ScheduleBuilderActions";
import {codeToClassType} from "../../../class/panel/body/widgets/class_types/ClassTypePrefWidget";

class ScheduleBuilderEventContainer extends PureComponent {
    // TODO write test for this method
    // dictate what behavior is needed too
    isSelected() {
        let userSelectedClass = ClassUtils.getClassFor(this.props.transactionID, this.props.selectedClasses);

        if (userSelectedClass && userSelectedClass.classTitle === this.props.classTitle) {
            if (this.props.usedBySections && this.intersect(this.props.usedBySections, this.props.currentSchedule).length > 0)
                return true;

            if (this.props.currentSchedule.includes(this.props.sectionNum))
                return true;
        }
        return false;
    }

    intersect(a, b) {
        let setA = new Set(a);
        let setB = new Set(b);
        let intersection = new Set([...setA].filter(x => setB.has(x)));
        return Array.from(intersection);
    }

    /**
     * Returns if the event should be shadowed transparently (whatever that means)
     *
     * Will shadow classes that aren't the same as the currently selected class
     * @returns {boolean}
     */
    isShadowed() {
        let userSelectedClass = ClassUtils.getClassFor(this.props.transactionID, this.props.selectedClasses);
        if (!userSelectedClass)
            return false;
        return userSelectedClass.classTitle !== this.props.classTitle;
    }

    getCourseID() {
        if (this.props.usedByID) {
            return this.props.usedByID.map((id, index) => (
                <div key={id + index}>
                    ID: {id}
                </div>
            ))
        }
        return (
            <div> ID: {this.props.id} </div>
        )
    }

    getDisplayComponent() {
        const classTitle = this.props.classTitle;

        const courseID = this.getCourseID();

        const TIME_STR = "h:mm a";
        const range = this.props.range;
        let startTime = 'TBD';
        let endTime = 'TBD';

        if (range) {
            startTime = range.start.format(TIME_STR);
            endTime = range.end.format(TIME_STR);
        }

        const time = `Time: ${startTime} - ${endTime}`;
        const location = `Location: ${this.props.location} ${this.props.room}`;
        const instructor = `Instructor: ${this.props.instructor}`;

        let formattedType = codeToClassType[this.props.type];
        const type = formattedType ? formattedType : "";
        const title = `${classTitle} ${type}`;

        return (
            <div className="ce-info__container">
                <div className="ce-info">
                    <div className="ce-info__title">
                        {title}
                    </div>
                    <div>
                        {courseID}
                    </div>
                    <div>
                        {location}
                    </div>
                    <div>
                        {instructor}
                    </div>
                    <div>
                        {time}
                    </div>
                </div>
            </div>
        )
    }


    replaceSectionNumInSchedule() {
        // TODO put formatting in another method
        let classTitle = ClassUtils.formatClassTitle(this.props.classTitle);
        let currentSchedule = this.props.currentSchedule.slice();
        currentSchedule = currentSchedule.filter(e => ClassUtils.formatSectionNum(e) !== classTitle);

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

        if (this.props.usedBySections && this.props.usedBySections.includes(this.props.currentSectionNum)) {
            // go back to input mode if we clicked on an event and its used by multiple events
            this.props.enterInputMode();
            this.props.setCurrentSectionNum(null);
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
        const isShadowed = this.isShadowed();

        return (
            <ClassEvent
                classTitle={this.props.classTitle}
                instructor={this.props.instructor}
                range={this.props.range}
                type={this.props.type}
                id={this.props.id}
                location={this.props.location}
                room={this.props.room}

                isSelected={isSelected}
                isShadowed={isShadowed}
                onClick={this.onClick.bind(this)}

                getDisplayComponent={this.getDisplayComponent.bind(this)}
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
    currentSectionNum: PropTypes.string.isRequired,
    currentSchedule: PropTypes.array.isRequired,
    sectionNum: PropTypes.string.isRequired,
    usedBySections: PropTypes.array,
    usedByID: PropTypes.array,
};
