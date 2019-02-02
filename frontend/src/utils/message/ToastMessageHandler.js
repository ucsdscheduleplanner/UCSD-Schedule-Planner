import {toast} from 'react-toastify';

export class ToastMessageHandler {
    showError(message, life) {
        toast.error(message, {autoClose: life});
    }

    showSuccess(message, life) {
        toast.success(message, {autoClose: life});
    }
}
