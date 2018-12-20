import {GENERATE_SCHEDULE, INCREMENT_PROGRESS, FINISHED_GENERATING_SCHEDULE} from "../actions/ScheduleGenerationActions";
import WebWorker from "./WebWorker";
import {SGWorker} from "../schedulegeneration/SGWorker";



export const SGMiddleWare = store => {
    const worker = new WebWorker(SGWorker);
    worker.onmessage = msg => {
        let {type, generationResult, amount} = msg.data;
        switch(type) {
            case "FINISHED_GENERATION":
                store.dispatch({type: FINISHED_GENERATING_SCHEDULE, generating: false, generationResult: generationResult});
                break;
            case "INCREMENT_PROGRESS":
                store.dispatch({type: INCREMENT_PROGRESS, amount: amount});
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
