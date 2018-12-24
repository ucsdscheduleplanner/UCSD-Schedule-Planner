import React, {Component} from 'react';
import {connect} from "react-redux";
import ClassInput from "../components/landing/ClassInput";
import {bindActionCreators} from "redux";
import "../css/ClassInput.css";
import {getInputHandler} from "../actions/classinput/ClassInputHandler";
import {initDepartments} from "../actions/classinput/ClassInputActions";

class ClassInputContainer extends Component {

    constructor(props) {
        super(props);
        this.inputHandler = this.props.getInputHandler();
    }

    async componentDidMount() {
        this.props.initDepartments();
    }

    render() {
        return (
            <div className="ci-container">
                <div className="ci--title"> Add Classes</div>
                <ClassInput
                    inputHandler={this.inputHandler}

                    departments={this.props.departments}
                    courseNums={this.props.courseNums}
                    instructors={this.props.instructors}
                    types={this.props.types}

                    // need to control these globally for class editing purposes
                    // if they were state local to ClassInput, would not be able to hydrate them
                    department={this.props.department}
                    instructor={this.props.instructor}
                    courseNum={this.props.courseNum}
                    classTypesToIgnore={this.props.classTypesToIgnore}
                    priority={this.props.priority}

                    classTypesPerClass={this.props.classTypesPerClass}
                    instructorsPerClass={this.props.instructorsPerClass}
                    descriptionsPerClass={this.props.descriptionsPerClass}

                    editMode={this.props.editMode}
                />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getInputHandler: getInputHandler,
        initDepartments: initDepartments,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        departments: state.ClassInput.departments,
        courseNums: state.ClassInput.courseNums,
        instructors: state.ClassInput.instructors,
        types: state.ClassInput.types,

        department: state.ClassInput.department,
        instructor: state.ClassInput.instructor,
        courseNum: state.ClassInput.courseNum,
        classTypesToIgnore: state.ClassInput.classTypesToIgnore,
        priority: state.ClassInput.priority,

        classTypesPerClass: state.ClassInput.classTypesPerClass,
        instructorsPerClass: state.ClassInput.instructorsPerClass,
        descriptionsPerClass: state.ClassInput.descriptionsPerClass,

        editMode: state.ClassInput.editMode,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassInputContainer)
