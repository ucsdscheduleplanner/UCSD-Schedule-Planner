import {GENERATE_SCHEDULE, INCREMENT_PROGRESS, RECEIVE_SCHEDULE} from "../actions/ScheduleGenerationActions";
import WebWorker from "./WebWorker";
import {SGWorkerCode} from "../schedulegeneration/SGWorker";



export const SGMiddleWare = store => {
    const worker = new WebWorker(SGWorkerCode);
    worker.onmessage = msg => {
        let {type, schedule} = msg.data;
        let amount = msg.data.by;
        switch(type) {
            case "FINISHED_GENERATION":
                store.dispatch({type: RECEIVE_SCHEDULE, generating: false, schedule: schedule});
                break;
            case "INCREMENT_PROGRESS":
                store.dispatch({type: INCREMENT_PROGRESS, by: amount})
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
