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

    showWarning(message) {
        this.messageQueue.push(message);
        console.warn(message);
    }
}
