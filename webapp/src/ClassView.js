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

    render() {
        return (
            <React.Fragment>
                <Segment color="teal" raised>
                    <Header as="h1" content={this.props.data['class']}/>
                    <Label color='red' floating onClick={this.deleteClassView.bind(this)}>
                        <Icon name="delete"/>
                    </Label>
                </Segment>
            </React.Fragment>
        );
    }
}

