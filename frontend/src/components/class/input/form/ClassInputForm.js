import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import "./ClassInputForm.css";
import {MyAutocomplete} from "../../../../utils/autocomplete/MyAutocomplete";
import {Button} from "../../../../utils/button/Button";

import {ReactComponent as SearchIcon} from "../../../../svg/icon-search.svg";

export class ClassInputForm extends PureComponent {
    render() {
        console.log("rerendering");
        console.log(this.props.courseNums);
        console.log((this.props.editID ? this.props.editID : "") + this.props.department);

        // TODO consider having a transaction ID per time, and have cancel change the transaction id, then can
        // just add the transaction id on add, and for edit
        return (
            <React.Fragment>
                <div className="class-input__form__header">
                    <SearchIcon className="svg-icon" width="1em" height="1em"/>
                    <span className="class-input__form__header__title"> Search Courses to Add </span>
                </div>

                <div className="class-input__form__body">
                    <div className="class-input__form__department">
                        <label htmlFor="department">Department Code</label>
                        <MyAutocomplete
                            key={this.props.transactionID}
                            activeOnClick={true}
                            className="class-input__form__autocomplete"
                            suggestions={this.props.departments}
                            value={this.props.department}
                            onSelect={(e) => this.props.inputHandler.onDepartmentChange(e, true)}
                            defaultValue={"CSE"}
                            label="department"/>
                    </div>
                    <div className="class-input__form__courseNum">
                        <label htmlFor="courseNum">Course Number</label>
                        <MyAutocomplete
                            key={this.props.transactionID + this.props.department}
                            activeOnClick={false}
                            className="class-input__form__autocomplete"
                            suggestions={this.props.courseNums}
                            value={this.props.courseNum}
                            onSelect={(e) => this.props.inputHandler.onCourseNumChange(e, true)}
                            defaultValue={"11"}
                            disabled={!this.props.departments.includes(this.props.department)}
                            label="courseNum"/>
                    </div>

                    <div className="class-input__form__buttons">
                        <div className="class-input__form__add-button">
                            <Button label="Add" onClick={() => this.props.inputHandler.handleAdd()}/>
                        </div>
                        <div className="class-input__form__cancel-button">
                            <Button label="Cancel" onClick={() => this.props.enterInputMode()}/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

ClassInputForm.propTypes = {
    transactionID: PropTypes.string.isRequired
};