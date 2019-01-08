import React, {PureComponent} from 'react';
import {ClassInputPanel} from "./ClassInputPanel";
import {connect} from "react-redux";


class ClassInputPanelContainer extends PureComponent {

    render() {
        return (
            <ClassInputPanel inputHandler={this.props.inputHandler} classList={this.props.classList}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        classList: state.ClassList.selectedClasses
    }
}

export default connect(mapStateToProps)(ClassInputPanelContainer);