import React, {Component} from 'react';
import {Header, Icon, Label, Segment} from 'semantic-ui-react'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {removeClass, removeConflict} from '../actions/index';

class ClassView extends Component {
    removeClass() {
        this.props.removeClass(this.props.index);
    }

    removeConflict(conflict) {
        this.props.removeConflict(this.props.index, conflict);
    }

    render() {
        // must convery key into integer
        let currentClass = this.props.selectedClasses[parseInt(this.props.index)];
        let conflicts = [];
        if(currentClass['conflicts']) {
            conflicts = currentClass['conflicts'].map((conflict) => {
                return (
                     <Label color='red' horizontal={true} onClick={this.removeConflict.bind(this, conflict)}>
                         {conflict}
                         <Icon name="delete"/>
                    </Label>
                );
            });
        }

        return (
            <React.Fragment>
                <Segment color="teal" raised>
                    <Header as="h1" content={currentClass['class']}/>
                    <Label color='red' floating onClick={this.removeClass.bind(this)}>
                        <Icon name="delete"/>
                    </Label>
                    {conflicts.length > 0 && conflicts}
                </Segment>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        selectedClasses: state.ClassSelection
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeClass: removeClass,
        removeConflict: removeConflict
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ClassView);

