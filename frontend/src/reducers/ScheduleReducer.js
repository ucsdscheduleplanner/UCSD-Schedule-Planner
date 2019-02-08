/**
 Reducer to manage state for schedules in general
 **/

import {SET_CLASS_DATA, SET_CURRENT_SCHEDULE, SET_SCHEDULE_MODE} from "../actions/schedule/ScheduleActions";

export const GENERATOR_MODE = "GENERATOR_MODE";
export const BUILDER_MODE = "BUILDER_MODE";

export default function ScheduleReducer(state = {
    currentSchedule: [],
    classData: [],
    scheduleMode: null
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
        case SET_SCHEDULE_MODE:
            return Object.assign({}, state, {
                scheduleMode: action.scheduleMode
            });
        default:
            return state;
    }
}
