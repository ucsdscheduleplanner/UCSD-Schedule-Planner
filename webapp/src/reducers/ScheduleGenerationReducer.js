import {
    RECEIVE_SCHEDULE, REQUEST_SCHEDULE, SET_CALENDAR_MODE, SET_PROGRESS,
    SET_UID
} from '../actions/ScheduleGenerationActions';

/**
 Should be able to access this through state.ScheduleGeneration
 **/

export default function ScheduleGeneration(state = {
    calendarMode: false,
    generating: false,
    generatingProgress: 0,
    uid: 0,
    generateSuccess: true,
    schedule: []
}, action) {
    switch (action.type) {
        case REQUEST_SCHEDULE:
            return Object.assign({}, state, {
                generating: action.generating
            });
        case RECEIVE_SCHEDULE:
            if (action.schedule && action.schedule.length > 0) {
                return Object.assign({}, state, {
                    generating: action.generating,
                    schedule: action.schedule,
                    generateSuccess: true,
                });
            } else {
                console.error("Could not generate schedule");
                return Object.assign({}, state, {
                    generating: action.generating,
                    generateSuccess: false,
                    schedule: []
                });
            }
        case SET_CALENDAR_MODE:
            return Object.assign({}, state, {
                calendarMode: action.calendarMode
            });
        case SET_UID:
            return Object.assign({}, state, {
                uid: action.uid,
            });
        case SET_PROGRESS:
            return Object.assign({}, state, {
                generatingProgress: action.generatingProgress
            });
        default:
            return state;
    }
}