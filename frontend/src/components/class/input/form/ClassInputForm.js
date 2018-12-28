import React, {PureComponent} from 'react';
import Autosuggest from 'react-autosuggest';
import "./ClassInputForm.css";

export class ClassInputForm extends PureComponent {

    render() {

        const departmentProps = {
            id: "department",
            value: "hello",
            onChange: () => {
            }
        };

        const courseNumProps = {
            id: "courseNum",
            value: "hello",
            onChange: () => {
            }
        };

        return (
            <React.Fragment>
                <div className="class-input__form__header">
                    Search Courses to Add
                </div>

                <div className="class-input__form__body">
                    <div className="class-input__form__department">
                        <label htmlFor="department">Department Code</label>
                        <Autosuggest
                            suggestions={[]}
                            inputProps={departmentProps}
                        />
                    </div>
                    <div className="class-input__form__courseNum">
                        <label htmlFor="courseNum">Course Number</label>
                        <Autosuggest id="courseNum"
                                     suggestions={[]}
                                     inputProps={courseNumProps}
                        />
                    </div>

                    <div className="class-input__form__add-button">
                        <button>Add class</button>
                    </div>
                    <div className="class-input__form__cancel-button">
                        <button>Cancel</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}