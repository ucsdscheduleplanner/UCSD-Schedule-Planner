import React, {Component} from 'react';
import {
    Container,
    Form,
    Grid,
    Segment,
    Header
} from 'semantic-ui-react'

export default class ClassView extends Component {


    render() {
        return (
            <React.Fragment>
                <Segment color="teal" raised>
                    <Header as="h1" content={this.props.class} />
                </Segment>
            </React.Fragment>
        );
    }
}

