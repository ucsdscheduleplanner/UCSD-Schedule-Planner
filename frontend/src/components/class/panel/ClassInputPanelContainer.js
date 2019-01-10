import React, {PureComponent} from 'react';
import {ClassInputPanel} from "./ClassInputPanel";
import {connect} from "react-redux";


class ClassInputPanelContainer extends PureComponent {

    render() {
        console.log(this.props.id);
        return (
            <ClassInputPanel inputHandler={this.props.inputHandler}
                             classList={this.props.classList}
                             transactionID={this.props.transactionID}/>
        )
    }
}

function mapStateToProps(state) {
    return {
        classList: state.ClassList.selectedClasses,
        transactionID: state.ClassInput.transactionID
    }
}

export default connect(mapStateToProps)(ClassInputPanelContainer);