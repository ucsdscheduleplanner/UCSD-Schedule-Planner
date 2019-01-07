import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {InstructorPrefWidget} from "./InstructorPrefWidget";


class InstructorPrefWidgetContainer extends PureComponent {

    render() {
        return (
            //<InstructorPrefWidget instructors={this.props.instructors} inputHandler={this.props.inputHandler}/>
            <InstructorPrefWidget instructors={["Lam, Tin Yu", "Crowell, James", "Staff"]} inputHandler={this.props.inputHandler}/>
        )
    }
}

InstructorPrefWidgetContainer.propTypes = {
    inputHandler: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        instructors: state.ClassInput.instructors
    }
}

export default connect(mapStateToProps)(InstructorPrefWidgetContainer);
