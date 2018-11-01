/*
    This class will be the side panel where the user can alter
    the generationResult options.
 */

import React, {Component} from 'react';
import "../../css/RightSidePanel.css";
import ClassInputContainer from "../../containers/ClassInputContainer";

export default class RightSidePanel extends Component {
    render() {
        return (
            <div className="rsp">
                <ClassInputContainer/>
            </div>
        );
    }
}
