import {REQUEST_SCHEDULE, RECEIVE_SCHEDULE} from '../actions/scheduleActions';

/**
 Should be able to access this through state.ScheduleGeneration
 **/

export default function ScheduleGeneration(state = {scheduleScreen:false, generating: false,
                                                    schedule: []}, action) {
    switch (action.type) {
        case REQUEST_SCHEDULE:
            return Object.assign({}, state, {
                generating: action.generating
            });
            break;
        case RECEIVE_SCHEDULE:
            return Object.assign({}, state, {
                generating: action.generating,
                schedule: action.schedule,
                scheduleScreen: action.scheduleScreen
            });
            break;
        default:
            return state;
    }
}