

export class ConsoleMessageHandler {

    constructor() {
        this.messageQueue = []
    }

    showError(message) {
        this.messageQueue.push(message);
        console.error(message);
    }

    showSuccess(message) {
        this.messageQueue.push(message);
        console.log(message);
    }
}