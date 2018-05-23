import {
    PLAN_SCHEDULE, RECEIVE_SCHEDULE, REQUEST_SCHEDULE, SET_CALENDAR_MODE,
    SET_UID
} from '../actions/ScheduleActions';

/**
 Should be able to access this through state.ScheduleGeneration
 **/

export default function ScheduleGeneration(state = {
    calendarMode: false, generating: false, uid: 0,
    generateSuccess: false, schedule: []
}, action) {
    switch (action.type) {
        case REQUEST_SCHEDULE:
            return Object.assign({}, state, {
                generating: action.generating
            });
        case RECEIVE_SCHEDULE:
            if (action.schedule.length > 0) {
                return Object.assign({}, state, {
                    generating: action.generating,
                    schedule: action.schedule,
                    scheduleScreen: action.scheduleScreen
                });
            } else {
                return Object.assign({}, state, {
                    generating: action.generating,
                    generateSuccess: false,
                    scheduleScreen: false
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
        default:
            return state;
    }
}