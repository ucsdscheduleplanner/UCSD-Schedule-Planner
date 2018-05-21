import React, {Component} from 'react';
import {connect} from 'react-redux';
import ClassList from "../landing/ClassList";
import {bindActionCreators} from "redux";
import {removeClass} from "../actions/ClassInputActions";

class ClassListContainer extends Component {

    render() {
        return <ClassList
            removeClass={this.props.removeClass}
            removeConflict={this.props.removeConflict}

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
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassListContainer);

