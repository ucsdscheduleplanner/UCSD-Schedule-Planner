import React, {PureComponent} from 'react';
import {ClassInputPanel} from "./ClassInputPanel";
import {connect} from "react-redux";


class ClassInputPanelContainer extends PureComponent {

    render() {
        console.log(this.props.id);
        return (
            <ClassInputPanel inputHandler={this.props.inputHandler}
                             classList={this.props.classList}
                             id={this.props.id}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        classList: state.ClassList.selectedClasses,
        id: state.ClassInput.id
    }
}

export default connect(mapStateToProps)(ClassInputPanelContainer);