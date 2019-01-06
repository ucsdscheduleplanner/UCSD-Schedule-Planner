import React, {PureComponent} from 'react';
import {ClassInputPanel} from "./ClassInputPanel";
import {connect} from "react-redux";


class ClassInputPanelContainer extends PureComponent {

    render() {
        return (
            <ClassInputPanel classList={{0: "CSE 12", 1: "CSE 15L", 2: "CHEM 6A", 3: "HUM 1", 4: "ANTH 87"}}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        classList: state.ClassList.selectedClasses
    }
}

export default connect(mapStateToProps)(ClassInputPanelContainer);