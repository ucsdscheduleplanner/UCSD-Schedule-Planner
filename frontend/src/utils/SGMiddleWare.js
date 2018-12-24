import {
    FINISH_GENERATING,
    finishedGenerating,
    GENERATE_SCHEDULE,
    INCREMENT_PROGRESS, incrementProgress, updateWithResult
} from "../actions/ScheduleGenerationActions";
import WebWorker from "./WebWorker";
import {SGWorker} from "../schedulegeneration/SGWorker";


export const SGMiddleWare = store => {
    const worker = new WebWorker(SGWorker);
    worker.onmessage = msg => {
        let {type, generationResult, amount} = msg.data;

        switch(type) {
            case FINISH_GENERATING:
                // must update with result first because each dispatch causes a rerender so could mess stuff up
                // TODO look into redux-batched-updates
                store.dispatch(updateWithResult(generationResult));
                store.dispatch(finishedGenerating());
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

        console.log(action);
        worker.postMessage(action);
        return next(action);
    }
};
