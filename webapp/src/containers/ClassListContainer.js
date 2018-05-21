import React, {Component} from 'react';
import {connect} from 'react-redux';
import ClassList from "../landing/ClassList";
import {bindActionCreators} from "redux";
import {enterEditMode, removeClass} from "../actions/ClassInputActions";

class ClassListContainer extends Component {

    render() {
        return <ClassList
            removeClass={this.props.removeClass}
            enterEditMode={this.props.enterEditMode}

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
        enterEditMode: enterEditMode
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassListContainer);

