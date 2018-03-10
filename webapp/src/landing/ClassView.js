import React, {Component} from 'react';
import {
    Label,
    Icon,
    Segment,
    Header
} from 'semantic-ui-react'

export default class ClassView extends Component {

    deleteClassView() {
        this.props.deleteClassView(this.props.data)
    }

    deleteConflict(conflict) {
        this.props.deleteConflict(this.props.index, conflict);
        //this.props.deleteConflict()
    }

    render() {
        let conflicts = [];
        if(this.props.data['conflicts']) {
            conflicts = this.props.data['conflicts'].map((conflict) => {
                return (
                     <Label color='grey' horizontal={true} onClick={this.deleteConflict.bind(this, conflict)}>
                         {conflict}
                    </Label>
                );
            });
        }

        return (
            <React.Fragment>
                <Segment color="teal" raised>
                    <Header as="h1" content={this.props.data['class']}/>
                    <Label color='red' floating onClick={this.deleteClassView.bind(this)}>
                        <Icon name="delete"/>
                    </Label>
                    {conflicts.length > 0 && conflicts}
                </Segment>
            </React.Fragment>
        );
    }
}

