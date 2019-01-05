import React, {PureComponent} from 'react';
import "./ClassInput.css";
import ClassInputFormContainer from "./form/ClassInputFormContainer";


export default class ClassInput extends PureComponent {
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.props.inputHandler.autosave();
    }

    render() {
        return (
            <React.Fragment>
                <div className="class__input__form">
                    <ClassInputFormContainer inputHandler={this.props.inputHandler}/>
                </div>
            </React.Fragment>
        )
    }
}
