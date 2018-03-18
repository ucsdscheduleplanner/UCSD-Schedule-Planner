import React, {Component} from 'react';
import ClassView from "./ClassView";
import {Button} from "semantic-ui-react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {removeClass} from '../actions/index.js';

export class ClassDisplay extends Component {
    constructor(props) {
        super(props);
    }

    deleteConflict(index, conflict) {
        let hi = this.state.selectedClasses[index].filter((c) => c !== conflict);
    }

    render() {
        let selectedClasses = Object.keys(this.props.selectedClasses)
            // we need index to add more than one class
            .map((key, index) => (
                <ClassView
                    index={key}
                    data={this.props.selectedClasses[key]}
                    deleteConflict={this.deleteConflict.bind(this)}
                />
            ));

        return (
            <React.Fragment>
                {selectedClasses}
                {
                    selectedClasses.length > 0 &&
                    <Button positive floated="right"
                            onClick={this.props.generateSchedule}
                            content="Generate Schedule"/>
                }
            </React.Fragment>
        );
    }
}


function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection
    }
}

export default connect(mapStateToProps)(ClassDisplay);
