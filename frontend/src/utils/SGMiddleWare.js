import {
    FINISH_GENERATING,
    finishedGenerating,
    GENERATE_SCHEDULE,
    INCREMENT_PROGRESS, incrementProgress, updateWithResult
} from "../actions/ScheduleGeneratorActions";
import WebWorker from "./WebWorker";
import {SGWorker} from "../schedulegeneration/SGWorker";


export const SGMiddleWare = store => {
    const worker = new WebWorker(SGWorker);
    worker.onmessage = msg => {
        let {type, generationResult, amount} = msg.data;

        switch(type) {
            case FINISH_GENERATING:
                store.dispatch(finishedGenerating());
                store.dispatch(updateWithResult(generationResult));
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
