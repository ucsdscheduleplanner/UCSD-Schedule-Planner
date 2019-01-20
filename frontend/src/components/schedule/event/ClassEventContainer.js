import React, {PureComponent} from 'react';
import {ClassEvent} from "./ClassEvent";
import {connect} from "react-redux";


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

export default connect(mapStateToProps)(ClassEventContainer);
