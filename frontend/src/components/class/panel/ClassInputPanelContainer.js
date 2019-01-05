import React, {PureComponent} from 'react';
import {ClassInputPanel} from "./ClassInputPanel";
import {connect} from "react-redux";


class ClassInputPanelContainer extends PureComponent {

    render() {
        console.log(this.props);
        return (
            <ClassInputPanel classList={{0: "CSE 15L", 1: "CSE 12", 2: "CSE 11"}}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        classList: state.ClassList.selectedClasses
    }
}

export default connect(mapStateToProps)(ClassInputPanelContainer);