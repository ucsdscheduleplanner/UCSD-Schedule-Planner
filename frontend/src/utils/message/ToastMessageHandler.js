import {toast} from 'react-toastify';

export class ToastMessageHandler {
    showError(message, life) {
        toast.error(message, {autoClose: life});
    }

    showSuccess(message, life) {
        toast.success(message, {autoClose: life});
    }

    showWarning(message, life) {
        toast.info(message, {autoClose: life});
    }
}
