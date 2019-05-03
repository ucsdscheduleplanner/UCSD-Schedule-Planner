import React from 'react';
import PropTypes from "prop-types";

import "./InstructorPrefWidget.css";
import {InstructorPrefWidget} from "./InstructorPrefWidget";
import SelectedClass from "../../../../../../actions/classinput/SelectedClass";
import {connect} from "react-redux";

class InstructorPrefWidgetContainer extends React.PureComponent {


    render() {
        const instructors = this.getInstructors();
        return (
            <InstructorPrefWidget instructors={instructors}
                                  inputHandler={this.props.inputHandler}
                                  classTitle={this.props.Class.classTitle}
                                  isSelected={this.isSelected.bind(this)} />
        )
    }

    getInstructors() {
                console.log(this.props);
        const instructors = this.props.instructorRegistry[this.props.Class.classTitle];
        return instructors ? instructors : [];
    }

    isSelected(instructor) {
        return this.props.Class.instructor === instructor;
    }
}

InstructorPrefWidgetContainer.propTypes = {
    instructors: PropTypes.array.isRequired,
    Class: PropTypes.instanceOf(SelectedClass).isRequired,
    inputHandler: PropTypes.object.isRequired
};


function mapStateToProps(state) {
    console.log(state);
    return {
        instructorRegistry: state.ClassRegistry.instructors
    }
}

export default connect(mapStateToProps)(InstructorPrefWidgetContainer)
