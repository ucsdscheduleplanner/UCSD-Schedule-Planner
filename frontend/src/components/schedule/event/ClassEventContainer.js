import React, {PureComponent} from 'react';
import {ClassEvent} from "./ClassEvent";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {toggleEditMode} from "../../../actions/classinput/ClassInputActions";


class ClassEventContainer extends PureComponent  {
    render() {
        return (
            <ClassEvent {...this.props} />
        )
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassList.selectedClasses,
        transactionID: state.ClassInput.transactionID
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleEditMode: toggleEditMode,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassEventContainer);
