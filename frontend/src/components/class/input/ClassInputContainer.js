import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import ClassInput from "./ClassInput";
import {getInputHandler} from "../../../actions/classinput/ClassInputHandler";
import {initDepartments} from "../../../actions/classinput/ClassInputActions";

class ClassInputContainer extends Component {

    constructor(props) {
        super(props);
        this.inputHandler = this.props.getInputHandler();
    }

    async componentDidMount() {
        this.props.initDepartments();
    }

    render() {
        return (
            <ClassInput inputHandler={this.inputHandler}/>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getInputHandler: getInputHandler,
        initDepartments: initDepartments,
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(ClassInputContainer)
