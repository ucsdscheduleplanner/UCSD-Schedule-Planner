import React from 'react';
import PropTypes from "prop-types";

import "./InstructorPrefWidget.css";
import {InstructorPrefWidget} from "./InstructorPrefWidget";
import {connect} from "react-redux";

class InstructorPrefWidgetContainer extends React.PureComponent {


    render() {
        const instructors = this.getInstructors();
        return (
            <InstructorPrefWidget instructors={instructors}
                                  inputHandler={this.props.inputHandler}
                                  classTitle={this.classTitle}
                                  isSelected={this.isSelected.bind(this)}/>
        )
    }

    getInstructors() {
        const instructors = this.props.instructorRegistry[this.props.classTitle];
        return instructors ? instructors : [];
    }

    isSelected(instructor) {
        const selectedInstructor = this.props.instructorPreferences[this.props.classTitle];
        return selectedInstructor === instructor;
    }
}

InstructorPrefWidgetContainer.propTypes = {
    instructors: PropTypes.array.isRequired,
    selectedInstructor: PropTypes.string.isRequired,
    classTitle: PropTypes.string.isRequired,
    inputHandler: PropTypes.object.isRequired
};


function mapStateToProps(state) {
    return {
        instructorRegistry: state.ClassRegistry.instructors,
        instructorPreferences: state.InstructorPreference.instructors
    }
}

export default connect(mapStateToProps)(InstructorPrefWidgetContainer)
