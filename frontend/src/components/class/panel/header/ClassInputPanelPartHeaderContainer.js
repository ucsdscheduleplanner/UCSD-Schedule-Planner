import React, {PureComponent} from 'react';
import {ClassInputPanelPartHeader} from "./ClassInputPanelPartHeader";
import {connect} from "react-redux";
import {enterEditMode} from "../../../../actions/classinput/ClassInputActions";
import {bindActionCreators} from "redux";

class ClassInputPanelPartHeaderContainer extends PureComponent {

    render() {
        // if there is a prop onClick that is passed down then it will mess up the enterEditMode
        // BEWARE
        return (
            <ClassInputPanelPartHeader onClick={this.props.enterEditMode} {...this.props} />
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
            enterEditMode: enterEditMode,
        }, dispatch,
    );
}

export default connect(null, mapDispatchToProps)(ClassInputPanelPartHeaderContainer);