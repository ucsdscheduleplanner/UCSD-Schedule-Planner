/**
 Reducer to manage state for schedules in general
 **/

import {SET_CLASS_DATA, SET_CURRENT_SCHEDULE} from "../actions/schedule/ScheduleActions";

export default function ScheduleReducer(state = {
    currentSchedule: [],
    classData: [],
}, action) {
    switch (action.type) {
        case SET_CURRENT_SCHEDULE:
            return Object.assign({}, state, {
                currentSchedule: action.currentSchedule
            });
        case SET_CLASS_DATA:
            return Object.assign({}, state, {
                classData: action.classData
            });
        default:
            return state;
    }
}
