import React, {PureComponent} from 'react';

import {ClassInputForm} from "./ClassInputForm";
import {connect} from "react-redux";


class ClassInputFormContainer extends PureComponent {

    render() {
        return (
            <ClassInputForm
                department={this.props.department}
                courseNum={this.props.courseNum}
                departments={this.props.departments}
                courseNums={this.props.courseNums}


                // this comes from ClassInput
                inputHandler={this.props.inputHandler}
            />
        )
    }
}

function mapStateToProps(state) {
    return {
        departments: state.ClassInput.departments,
        courseNums: state.ClassInput.courseNums,

        department: state.ClassInput.department,
        courseNum: state.ClassInput.courseNum,
    }
}

export default connect(mapStateToProps)(ClassInputFormContainer)
