import React, {Component} from 'react';
import {connect} from "react-redux";
import ClassInput from "../landing/ClassInput";
import {
    setConflicts, setCurrentCourseNum, setCurrentDepartment, setCurrentInstructor,
    setPriority, addClass, editClass, removeClass, enterInputMode, setClassSummaryFromDepartment
} from "../actions/ClassInputActions";
import {setUID} from "../actions/ScheduleGenerationActions";
import {bindActionCreators} from "redux";
import {DataFetcher} from "../utils/DataFetcher";
import "../css/ClassInput.css";

class ClassInputContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            departments: []
        };
    }

    async componentDidMount() {
        let departments = await DataFetcher.fetchDepartments();
        // error message from React here but will be fixed in future versions
        this.setState({departments: departments});
    }

    getClassSummary(department) {
        return DataFetcher.fetchClassSummaryFor(department);
    }

    render() {
        return (
            <React.Fragment>
                <div className="ci-container">
                    <div className="ci--title"> Add Classes </div>
                    <ClassInput
                        messageHandler={this.props.messageHandler}

                        generateSuccess={this.props.generateSuccess}

                        editMode={this.props.editMode}
                        editClass={this.props.editClass}
                        enterInputMode={this.props.enterInputMode}
                        editUID={this.props.editUID}

                        removeClass={this.props.removeClass}

                        addClass={this.props.addClass}
                        setUID={this.props.setUID}
                        getClassSummary={this.getClassSummary}

                        setCurrentDepartment={this.props.setCurrentDepartment}
                        setCurrentInstructor={this.props.setCurrentInstructor}
                        setCurrentCourseNum={this.props.setCurrentCourseNum}
                        setConflicts={this.props.setConflicts}
                        setPriority={this.props.setPriority}
                        setClassSummaryFromDepartment={this.props.setClassSummaryFromDepartment}

                        currentDepartment={this.props.currentDepartment}
                        currentInstructor={this.props.currentInstructor}
                        currentCourseNum={this.props.currentCourseNum}
                        conflicts={this.props.conflicts}
                        priority={this.props.priority}

                        courseNums={this.props.courseNums}
                        classTypesPerClass={this.props.classTypesPerClass}
                        instructorsPerClass={this.props.instructorsPerClass}

                        selectedClasses={this.props.selectedClasses}
                        departments={this.state.departments}
                        requesting={this.props.requesting}
                        uid={this.props.uid}
                    />
                </div>
            </React.Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setConflicts: setConflicts,
        setPriority: setPriority,
        setCurrentInstructor: setCurrentInstructor,
        setCurrentDepartment: setCurrentDepartment,
        setClassSummaryFromDepartment: setClassSummaryFromDepartment,
        setCurrentCourseNum: setCurrentCourseNum,

        enterInputMode: enterInputMode,
        editClass: editClass,
        removeClass: removeClass,

        addClass: addClass,
        setUID: setUID
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        messageHandler: state.ClassInput.messageHandler,

        currentDepartment: state.ClassInput.currentDepartment,
        currentInstructor: state.ClassInput.currentInstructor,
        currentCourseNum: state.ClassInput.currentCourseNum,
        conflicts: state.ClassInput.conflicts,
        priority: state.ClassInput.priority,

        generateSuccess: state.ScheduleGeneration.generateSuccess,
        editMode: state.ClassInput.editMode,
        editUID: state.ClassInput.editUID,

        selectedClasses: state.ClassSelection,
        departments: state.ClassInput.departments,

        courseNums: state.ClassInput.courseNums,
        classTypesPerClass: state.ClassInput.classTypesPerClass,
        instructorsPerClass: state.ClassInput.instructorsPerClass,

        requesting: state.ClassInput.requesting,
        uid: state.ScheduleGeneration.uid,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassInputContainer)
