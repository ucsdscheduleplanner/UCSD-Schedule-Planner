import React, {Component} from 'react';
import {connect} from 'react-redux';
import ClassList from "../landing/ClassList";
import {bindActionCreators} from "redux";
import {enterEditMode, removeClass} from "../actions/ClassInputActions";
import {exitCalendarMode} from "../actions/ScheduleGenerationActions";

class ClassListContainer extends Component {

    render() {
        return <ClassList
            removeClass={this.props.removeClass}
            enterEditMode={this.props.enterEditMode}
            exitCalendarMode={this.props.exitCalendarMode}

            selectedClasses={this.props.selectedClasses}
        />
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeClass: removeClass,
        enterEditMode: enterEditMode,
        exitCalendarMode: exitCalendarMode,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassListContainer);

