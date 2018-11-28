/*
    This class will be the side panel where classes will appear
    after they are added.
 */

import React, {Component} from 'react';
import "../../css/LeftSidePanel.css";
import ClassListContainer from "../../containers/ClassListContainer";

export class LeftSidePanel extends Component {
    render() {
        return (
            <div className="left-side-panel">
                <ClassListContainer/>
            </div>
        )
    }
}
