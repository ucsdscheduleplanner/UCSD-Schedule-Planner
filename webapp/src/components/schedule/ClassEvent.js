import React, {Component} from 'react';
import {Dialog} from 'primereact/components/dialog/Dialog';
import {Button} from "../../../node_modules/primereact/components/button/Button";


export default class CustomEvent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    render() {
        console.log(this.props.event);
        const classTitle = `${this.props.event.classTitle} ${this.props.event.type}`;

        const info = {

        };
        return (
            <React.Fragment>
                <Dialog header={classTitle} visible={this.state.visible} width="350px" modal={true}
                        minY={70} onHide={e => this.setState({visible: false})}
                        blockScroll={true}>
                    {JSON.stringify(this.props.event)}
                </Dialog>

                <Button label={classTitle} style={{width: "100%", height: "100%"}}onClick={e => this.setState({visible: true})}/>
            </React.Fragment>
        )
    }
}