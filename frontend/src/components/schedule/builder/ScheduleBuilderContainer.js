import React, {PureComponent} from 'react';
import {connect} from "react-redux";
import {ScheduleBuilder} from "./ScheduleBuilder";
import ClassUtils from "../../../utils/class/ClassUtils";

class ScheduleBuilderContainer extends PureComponent {

    mergeClasses(sectionNums, currentSchedule) {
        let ret = sectionNums.slice();
        for(let i = 0; i < currentSchedule.length; i++) {
            let sectionNum = currentSchedule[i];
            if(!sectionNums.includes(sectionNum)) {
                ret.push(sectionNum);
            }
        }
        return ret;
    }

    /**
     * This function should return what will be displayed in the schedule builder - namely all the
     * classes that have the same title as the currently selected classes + the classes that the user has already
     * put into the schedule
     */
    getDisplayedSchedule() {
        let userSelectedClass = ClassUtils.getClassFor(this.props.transactionID, this.props.selectedClasses);
        if (!userSelectedClass) {
            console.warn("No class selected, breaking");
            return this.props.currentSchedule;
        }

        let Class = ClassUtils.getClassDataFor(userSelectedClass.classTitle, this.props.classData);
        if (!Class) {
            console.warn(`No class data for ${userSelectedClass.classTitle}, breaking`);
            return this.props.currentSchedule;
        }

        let sectionNums = Class.sections.map(section => section.sectionNum);
        return this.mergeClasses(sectionNums, this.props.currentSchedule);
    }

    render() {
        console.log("CURRENT SCHEDULE");
        console.log(this.getDisplayedSchedule());
        return (
            <ScheduleBuilder
                //currentSchedule={this.props.currentSchedule}
                currentSchedule={this.getDisplayedSchedule()}
                classData={this.props.classData}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        currentSchedule: state.Schedule.currentSchedule,
        transactionID: state.ClassInput.transactionID,
        selectedClasses: state.ClassList.selectedClasses,
        classData: state.Schedule.classData,
    }
}

export default connect(mapStateToProps)(ScheduleBuilderContainer)
