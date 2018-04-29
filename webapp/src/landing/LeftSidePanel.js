/*
    This class will be the side panel where classes will appear
    after they are added.
 */

import React, {Component} from 'react';
import "../css/LeftSidePanel.css";

export class LeftSidePanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <div className="left-side-panel">
                </div>
            </React.Fragment>
        )
    }
}
