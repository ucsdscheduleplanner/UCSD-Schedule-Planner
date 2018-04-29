/*
    This class will hold the form for inputting classes.
 */

import React, {Component} from 'react';
import ClassInput from './ClassInput';
import "../css/MainPanel.css";

export class MainPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            priority: null,
            city: null,
            cities: null,
        };
    }

    render() {
        return (
            <div className="main-panel">
                <ClassInput />

            </div>
        )
    }
}