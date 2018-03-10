import React, {Component} from 'react';
import ClassView from "./ClassView";
import {Button} from "semantic-ui-react";

export default class ClassDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedClasses: props.selectedClasses
        }
    }

    deleteConflict(index, conflict) {
        let hi = this.state.selectedClasses[index].filter((c) => c !== conflict);
    }

    render() {
        let selectedClasses = this.props.selectedClasses
            .filter((data) => data !== undefined && data !== null)
            // we need index to add more than one class
            .map((data, index) => (
                <ClassView
                    index={index}
                    data={data}
                    deleteClassView={this.props.deleteClassView}
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