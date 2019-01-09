import React, {PureComponent} from 'react';
import "./ClassInput.css";
import ClassInputFormContainer from "./form/ClassInputFormContainer";
import ClassInputPanelContainer from "../panel/ClassInputPanelContainer";


export default class ClassInput extends PureComponent {

    render() {
        return (
            <React.Fragment>
                <div className="class-input__form">
                    <ClassInputFormContainer inputHandler={this.props.inputHandler}/>
                </div>
                <div className="class-input__panel">
                    <ClassInputPanelContainer inputHandler={this.props.inputHandler} />
                </div>
            </React.Fragment>
        )
    }
}
