import {
    INCREMENT_PROGRESS,
    FINISH_GENERATING,
    START_GENERATING,
    SET_PROGRESS,
    SET_TOTAL_POSSIBLE_NUM_SCHEDULE,
    UPDATE_WITH_GENERATION_RESULT
} from '../actions/ScheduleGeneratorActions';

/**
 Should be able to access this through state.ScheduleGeneration
 **/

export default function ScheduleGeneration(state = {
    generating: false,
    generatingProgress: 0,
    totalNumPossibleSchedule: 0,
    uid: 0,
    generateSuccess: true,
    generationResult: {schedules: [], errors: {}},
    scheduleID: 0,
}, action) {
    switch (action.type) {
        case START_GENERATING:
            return Object.assign({}, state, {
                generating: action.generating
            });
        case FINISH_GENERATING:
            return Object.assign({}, state, {
                generating: action.generating
            });
        case UPDATE_WITH_GENERATION_RESULT:
            let generateSuccess = action.generationResult.length > 0;
            console.log(action.generationResult);
            return Object.assign({}, state, {
                generationResult: action.generationResult,
                generateSuccess: generateSuccess,
                scheduleID: state.scheduleID + 1
            });
        case SET_PROGRESS:
            return Object.assign({}, state, {
                generatingProgress: action.generatingProgress
            });
        case INCREMENT_PROGRESS:
            return Object.assign({}, state, {
                generatingProgress: state.generatingProgress + action.amount
            });
        case SET_TOTAL_POSSIBLE_NUM_SCHEDULE:
            return Object.assign({}, state, {
                totalNumPossibleSchedule: action.totalNumPossibleSchedule
            });
        default:
            return state;
    }
}