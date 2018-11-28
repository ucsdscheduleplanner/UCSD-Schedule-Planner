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

    showError(detail, life) {
        this.messageHandler.show({severity: "error", summary: "Failure", detail: detail, life: life});
    }

    showSuccess(detail, life) {
        this.messageHandler.show({severity: "success", summary: "Success", detail: detail, life: life});
    }
}

