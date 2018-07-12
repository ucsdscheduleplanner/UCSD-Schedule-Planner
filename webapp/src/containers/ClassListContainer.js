import React, {Component} from 'react';
import {connect} from 'react-redux';
import ClassList from "../landing/ClassList";
import {bindActionCreators} from "redux";
import {enterEditMode, enterInputMode, removeClass} from "../actions/ClassInputActions";

class ClassListContainer extends Component {

    render() {
        return <ClassList
            removeClass={this.props.removeClass}
            enterEditMode={this.props.enterEditMode}
            enterInputMode={this.props.enterInputMode}
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
        enterInputMode: enterInputMode,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassListContainer);

