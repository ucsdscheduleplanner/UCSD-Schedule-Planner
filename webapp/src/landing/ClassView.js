import React, {Component} from 'react';
import {Header, Icon, Label, Segment} from 'semantic-ui-react'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {removeClass} from '../actions/index';

class ClassView extends Component {
    removeClass() {
        this.props.removeClass(this.props.index);
    }

    deleteConflict(conflict) {
        this.props.deleteConflict(this.props.index, conflict);
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
                    <Label color='red' floating onClick={this.removeClass.bind(this)}>
                        <Icon name="delete"/>
                    </Label>
                    {conflicts.length > 0 && conflicts}
                </Segment>
            </React.Fragment>
        );
    }
}


function mapDispatchToState(dispatch) {
    return bindActionCreators({
        removeClass: removeClass
    }, dispatch);
}

export default connect(null, mapDispatchToState)(ClassView);

