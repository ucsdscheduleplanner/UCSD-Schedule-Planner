import {
    INCREMENT_PROGRESS,
    FINISHED_GENERATING_SCHEDULE,
    STARTING_GENERATING_SCHEDULE,
    SET_PROGRESS,
    SET_TOTAL_POSSIBLE_NUM_SCHEDULE,
    SET_UID
} from '../actions/ScheduleGenerationActions';

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
        case STARTING_GENERATING_SCHEDULE:
            return Object.assign({}, state, {
                generating: action.generating
            });
        case FINISHED_GENERATING_SCHEDULE:
            let generateSuccess = action.generationResult.length > 0;
            return Object.assign({}, state, {
                generating: action.generating,
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