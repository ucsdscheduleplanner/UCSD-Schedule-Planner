import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {ClassTypePrefWidget} from "./ClassTypePrefWidget";


class ClassTypePrefWidgetContainer extends PureComponent {

    render() {
        return (
            //<InstructorPrefWidget instructors={this.props.instructors} inputHandler={this.props.inputHandler}/>
            <ClassTypePrefWidget {...this.props} types={this.props.types} />
        )
    }
}

ClassTypePrefWidgetContainer.propTypes = {
    inputHandler: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        types: state.ClassInput.types
    }
}

export default connect(mapStateToProps)(ClassTypePrefWidgetContainer);