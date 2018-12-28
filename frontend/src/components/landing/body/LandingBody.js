import React, {PureComponent} from 'react';
import './LandingBody.css';
import ClassInput from "../../class/input/ClassInput";

export class LandingBody extends PureComponent {
    render() {
        return (
            <div className="landing__body">
                <div className="landing__body--left">
                    <ClassInput/>
                </div>
                <div className="landing__body--right">

                </div>
            </div>
        );
    }
}