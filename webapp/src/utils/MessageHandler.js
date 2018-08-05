import React, {Component} from 'react';
import {Growl} from "primereact/components/growl/Growl";


export default class MessageHandler extends Component {
    constructor(props) {
        super(props);
        this.messageHandler = React.createRef();
    }

    render() {
        return (
            <Growl ref={(el) => {
                if (el !== null) {
                    this.messageHandler = el;
                }
            }}/>
        );
    }

    showError(message, life) {
        this.messageHandler.show({severity: "error", summary: message, life: life});
    }

    showSuccess(message, life) {
        this.messageHandler.show({severity: "success", summary: message, life: life});
    }
}

