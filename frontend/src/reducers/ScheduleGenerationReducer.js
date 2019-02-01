import {
    INCREMENT_PROGRESS,
    FINISH_GENERATING,
    START_GENERATING,
    SET_PROGRESS,
    SET_TOTAL_POSSIBLE_NUM_SCHEDULE,
    SET_GENERATION_RESULT
} from '../actions/schedule/generation/ScheduleGenerationActions';

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
}, action) {
    switch (action.type) {
        case START_GENERATING:
            return Object.assign({}, state, {
                generating: action.generating,
                generatingProgress: 0,
            });
        case FINISH_GENERATING:
            return Object.assign({}, state, {
                generating: action.generating,
                totalNumPossibleSchedule: 1,
                generatingProgress: 1
            });
        case SET_GENERATION_RESULT:
            let generateSuccess = action.generationResult.length > 0;
            return Object.assign({}, state, {
                generationResult: action.generationResult,
                generateSuccess: generateSuccess,
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
