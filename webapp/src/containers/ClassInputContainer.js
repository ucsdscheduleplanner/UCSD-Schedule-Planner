import React, {Component} from 'react';
import {connect} from "react-redux";
import ClassInput from "../landing/ClassInput";
import {
    getClasses, getDepartments, setConflicts, setCurrentCourseNum, setCurrentDepartment, setCurrentInstructor,
    setPriority, addClass
} from "../actions/ClassInputActions";
import {setUID} from "../actions/ScheduleActions";
import {bindActionCreators} from "redux";

class ClassInputContainer extends Component {
    componentDidMount() {
        this.props.getDepartments();
    }

    render() {
        return <ClassInput
            addClass={this.props.addClass}
            setUID={this.props.setUID}
            getDepartments={this.props.getDepartments}
            getClasses={this.props.getClasses}

            setCurrentDepartment={this.props.setCurrentDepartment}
            setCurrentInstructor={this.props.setCurrentInstructor}
            setCurrentCourseNum={this.props.setCurrentCourseNum}
            setConflicts={this.props.setConflicts}
            setPriority={this.props.setPriority}

            currentDepartment={this.props.currentDepartment}
            currentInstructor={this.props.currentInstructor}
            currentCourseNum={this.props.currentCourseNum}
            conflicts={this.props.conflicts}
            priority={this.props.priority}

            classes={this.props.classes}
            selectedClasses={this.props.selectedClasses}
            departments={this.props.departments}
            classTypesPerClass={this.props.classTypesPerClass}
            instructorsPerClass={this.props.instructorsPerClass}
            requesting={this.props.requesting}
            uid={this.props.uid}
        />
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setConflicts: setConflicts,
        setPriority: setPriority,
        setCurrentInstructor: setCurrentInstructor,
        setCurrentDepartment: setCurrentDepartment,
        setCurrentCourseNum: setCurrentCourseNum,

        addClass: addClass,
        setUID: setUID,
        getDepartments: getDepartments,
        getClasses: getClasses
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        currentDepartment: state.ClassInput.currentDepartment,
        currentInstructor: state.ClassInput.currentInstructor,
        currentCourseNum: state.ClassInput.currentCourseNum,
        conflicts: state.ClassInput.conflicts,
        priority: state.ClassInput.priority,

        selectedClasses: state.ClassSelection,
        departments: state.ClassInput.departments,
        classes: state.ClassInput.classes,
        classTypesPerClass: state.ClassInput.classTypesPerClass,
        instructorsPerClass: state.ClassInput.instructorsPerClass,
        requesting: state.ClassInput.requesting,
        uid: state.ScheduleGeneration.uid,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassInputContainer)
