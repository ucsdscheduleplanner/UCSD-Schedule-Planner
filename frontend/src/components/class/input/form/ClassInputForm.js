import React, {PureComponent} from 'react';
import "./ClassInputForm.css";
import {MyAutocomplete} from "../../../../utils/autocomplete/MyAutocomplete";
import {Button} from "../../../../utils/button/Button";

import {ReactComponent as SearchIcon} from "../../../../svg/icon-search.svg";

export class ClassInputForm extends PureComponent {
    render() {
        console.log(this.props.departments.includes(this.props.department));
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
                            className="class-input__form__autocomplete"
                            suggestions={this.props.departments}
                            value={this.props.department}
                            onChange={(e) => this.props.inputHandler.onDepartmentChange(e)}
                            defaultValue={"CSE"}
                            label="department"/>
                    </div>
                    <div className="class-input__form__courseNum">
                        <label htmlFor="courseNum">Course Number</label>
                        <MyAutocomplete
                            className="class-input__form__autocomplete"
                            suggestions={this.props.courseNums}
                            value={this.props.courseNum}
                            onChange={(e) => this.props.inputHandler.onCourseNumChange(e)}
                            defaultValue={"11"}
                            disabled={!this.props.departments.includes(this.props.department)}
                            label="courseNum"/>
                    </div>

                    <div className="class-input__form__buttons">
                        <div className="class-input__form__add-button">
                            <Button label="Add"/>
                        </div>
                        <div className="class-input__form__cancel-button">
                            <Button label="Cancel"/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}