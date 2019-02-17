import React, {PureComponent} from 'react';
import {connect} from "react-redux";
import {ScheduleBuilder} from "./ScheduleBuilder";
import ClassUtils from "../../../utils/class/ClassUtils";
import {bindActionCreators} from "redux";
import {getCleanClassData} from "../../../actions/schedule/generation/ScheduleGenerationActions";
import {setCurrentSchedule} from "../../../actions/schedule/ScheduleActions";
import ScheduleBuilderEventWrapper from "./event/ScheduleBuilderEventWrapper";

class ScheduleBuilderContainer extends PureComponent {

    componentDidUpdate(prevProps) {
        // this.props has the new props
        // prepProps has the old props
        if (this.props.selectedClasses !== prevProps.selectedClasses) {
            this.props.getCleanClassData().then(() => {
                this.addNewSection();
            });
        }
    }

    /**
     * Will find the new class that was just added and put the first section into the current schedule
     */
    addNewSection() {
        const prevSchedule = this.props.currentSchedule.slice();
        const titles = prevSchedule.map(e => ClassUtils.formatSectionNum(e));
        for (let Class of this.props.classData) {
            const classTitle = ClassUtils.formatClassTitle(Class.title);
            if (!titles.includes(classTitle)) {
                for (let section of Class.sections) {
                    prevSchedule.push(section.sectionNum);
                    break;
                }
            }
        }
        this.props.setCurrentSchedule(prevSchedule);
    }

    mergeClasses(sectionNums, currentSchedule) {
        let ret = sectionNums.slice();
        for (let i = 0; i < currentSchedule.length; i++) {
            let sectionNum = currentSchedule[i];
            if (!sectionNums.includes(sectionNum)) {
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
        let ret = this.mergeClasses(sectionNums, this.props.currentSchedule);

        return ret;
    }

    testEqual(obj1, obj2) {
        let prevCourseID = obj1.id;
        let prevSectionNum = obj1.sectionNum;
        let prevUsedBySections = obj1.usedBySections;
        let prevUsedByID = obj1.usedByID;

        let prevRange = obj1.range;
        let prevRange2 = obj2.range;

        obj1.id = obj2.id;
        obj1.sectionNum = obj2.sectionNum;
        obj1.usedBySections = obj2.usedBySections;
        obj1.usedByID = obj2.usedByID;
        obj1.range = null;

        obj2.range = null;

        let shallowEqual = JSON.stringify(obj1) === JSON.stringify(obj2);

        obj1.id = prevCourseID;
        obj1.sectionNum = prevSectionNum;
        obj1.usedBySections = prevUsedBySections;
        obj1.usedByID = prevUsedByID;
        obj1.range = prevRange;

        obj2.range = prevRange2;
        return shallowEqual;
    }

    dedupeEventsInfo(eventsInfo) {
        const ret = [];
        let visited = Array(eventsInfo.length).fill(false);

        for (let i = 0; i < eventsInfo.length; i++) {
            if (visited[i])
                continue;

            let obj1 = eventsInfo[i];
            obj1.usedBySections = null;

            for (let j = i + 1; j < eventsInfo.length; j++) {
                if (visited[j])
                    continue;

                let obj2 = eventsInfo[j];
                obj2.usedBySections = null;

                const shallowEqual = this.testEqual(obj1, obj2);

                if (shallowEqual) {
                    if (!obj1.usedBySections)
                        obj1.usedBySections = new Set([obj1.sectionNum]);
                    if(!obj1.usedByID)
                        obj1.usedByID = new Set([obj1.id]);

                    obj1.usedByID.add(obj2.id);
                    obj1.usedBySections.add(obj2.sectionNum);
                    visited[j] = true;
                }
            }
            visited[i] = true;
            ret.push(obj1);
        }
        return ret;
    }

    render() {
        const displayedSchedule = this.getDisplayedSchedule();
        const displayedEventsInfo = ClassUtils.getEventInfo(displayedSchedule, this.props.classData);
        const eventsInfo = this.dedupeEventsInfo(displayedEventsInfo);
        const events = eventsInfo.map(e => new ScheduleBuilderEventWrapper(e));

        return (
            <ScheduleBuilder
                classData={this.props.classData}
                events={events}
            />
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCleanClassData: getCleanClassData,
        setCurrentSchedule: setCurrentSchedule
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        currentSchedule: state.Schedule.currentSchedule,
        transactionID: state.ClassInput.transactionID,
        selectedClasses: state.ClassList.selectedClasses,
        classData: state.Schedule.classData,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleBuilderContainer)
