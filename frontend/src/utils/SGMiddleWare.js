import {
    FINISH_GENERATING,
    finishedGenerating,
    GENERATE_SCHEDULE,
    INCREMENT_PROGRESS, incrementProgress, updateWithResult
} from "../actions/schedule/generation/ScheduleGenerationActions";
import WebWorker from "./WebWorker";
import {SGWorker} from "./schedulegeneration/SGWorker";

function getErrorMsg(errors) {
    let classWithMostConflicts = Object.keys(errors).reduce((key1, key2) => errors[key1].length > errors[key2].length ? key1 : key2);
    let conflicts = errors[classWithMostConflicts].join(", ");
    return `Failed to generate. Had the most trouble adding ${classWithMostConflicts}. During schedule generation, it 
        conflicted with ${conflicts}`
}

export const SGMiddleWare = store => {
    const worker = new WebWorker(SGWorker);
    worker.onmessage = msg => {
        let {type, generationResult, amount} = msg.data;

        switch (type) {
            case FINISH_GENERATING:
                // must update with result first because each dispatch causes a rerender so could mess stuff up
                // TODO look into redux-batched-updates
                store.dispatch(finishedGenerating());
                store.dispatch(updateWithResult(generationResult));

                // TODO consider adding schedule handler
                if (Object.keys(generationResult.errors).length > 0) {
                    store.getState().ClassInput.messageHandler.showError(getErrorMsg(generationResult.errors), 5000);
                }

                break;
            case INCREMENT_PROGRESS:
                store.dispatch(incrementProgress(amount));
                break;
            default:
                return;
        }
    };

    return next => action => {
        if (!action)
            return next(action);

        if (action.type !== GENERATE_SCHEDULE)
            return next(action);

        worker.postMessage(action);
        return next(action);
    }
};
