import React, {Component} from 'react';
import {connect} from "react-redux";
import ClassInput from "../landing/ClassInput";
import {getClasses, getDepartments} from "../actions/ClassInputActions";
import {setUID} from "../actions/ScheduleActions";
import {addClass} from "../actions/index";
import {bindActionCreators} from "redux";

class ClassInputContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getDepartments();
    }

    render() {
        return <ClassInput
            addClass={this.props.addClass}
            setUID={this.props.setUID}
            getDepartments={this.props.getDepartments}
            getClasses={this.props.getClasses}

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
        addClass: addClass,
        setUID: setUID,
        getDepartments: getDepartments,
        getClasses: getClasses
    }, dispatch);
}

function mapStateToProps(state) {
    return {
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
