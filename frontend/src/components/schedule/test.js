import React from 'react';

export class Test extends React.PureComponent {

    render() {
        //let attributes = event.attributes;
        //console.log(attributes);
        //const classTitle = `${attributes.title} ${event.type}`;

        /*const courseID = `Course ID: ${this.props.event.id}`;
        const startTime = this.props.event.start.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const endTime = this.props.event.end.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const time = `Time: ${startTime} - ${endTime}`;
        const location = `Location: ${this.props.event.location} ${this.props.event.room}`;
        const instructor = `Instructor: ${this.props.event.instructor}`;
*/
        return (
            <button className="ce-button" onClick={e => this.setState({visible: true})}>
                hi
            </button>
        );
    }
}
