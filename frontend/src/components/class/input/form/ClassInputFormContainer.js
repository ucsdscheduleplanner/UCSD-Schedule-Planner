import React, {PureComponent} from 'react';

import {ClassInputForm} from "./ClassInputForm";
import {connect} from "react-redux";
import {enterInputMode} from "../../../../actions/classinput/ClassInputActions";
import {bindActionCreators} from "redux";


class ClassInputFormContainer extends PureComponent {

    render() {
        return (
            <ClassInputForm
                department={this.props.department}
                courseNum={this.props.courseNum}
                departments={this.props.departments}
                courseNums={this.props.courseNums}
                transactionID={this.props.transactionID}
                editMode={this.props.editMode}

                // this comes from ClassInput
                inputHandler={this.props.inputHandler}
                enterInputMode={this.props.enterInputMode}
            />
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
            enterInputMode: enterInputMode,
        }, dispatch,
    );
}

function mapStateToProps(state) {
    return {
        transactionID: state.ClassInput.transactionID,
        editMode: state.ClassInput.editMode,
        departments: state.ClassInput.departments,
        courseNums: state.ClassInput.courseNums,

        department: state.ClassInput.department,
        courseNum: state.ClassInput.courseNum,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassInputFormContainer)
