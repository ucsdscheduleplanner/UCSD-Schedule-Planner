import React, {Component} from 'react';
import {
    Form,
    Segment
} from 'semantic-ui-react';


export default class ClassInput extends Component {
    render() {
        return <React.Fragment>
            <Segment color="teal" raised>
                <Form onSubmit={this.props.handleSubmit}
                      style={{display: "table", width: "100%", zIndex: 1}}>
                    <Form.Group widths='equal'>
                        <Form.Select search fluid
                                     onChange={(e, {value}) => this.props.handleDepartmentChange('department', value)}
                                     label='Department'
                                     options={this.props.departmentOptions}
                                     placeholder='Department'/>
                        <Form.Select search fluid
                                     onChange={(e, {value}) => this.props.changeState('selectedClass', value)}
                                     label='Classes' placeholder='Classes'
                                     options={this.props.classOptions}/>
                    </Form.Group>
                    <Form.Button positive floated="right" content="Add Class"/>
                </Form>
            </Segment>
        </React.Fragment>


        /*
            <Form.Group inline>
        <label>Ignore Overlaps: </label>
        <Form.Radio slider label='Lecture' value='ignoreLecture'
                    checked={this.state['ignoreLecture'] === true}
                    onChange={(e, {value}) => this.changeStateToggle(value)}/>
        <Form.Radio slider label='Other' value='ignoreOther'
                    checked={this.state['ignoreOther'] === true}
                    onChange={(e, {value}) => this.changeStateToggle(value)}/>
    </Form.Group>
    */
    }
}