
import {generateSchedule} from "../schedulegeneration/ScheduleGenerator";

export  const REQUEST_SCHEDULE = 'REQUEST_SCHEDULE';
export function requestSchedule() {
    return {
        type: REQUEST_SCHEDULE,
        generating: true,
    }
}

export const RECEIVE_SCHEDULE = 'RECEIVE_SCHEDULE';
export function receiveSchedule(schedule) {
    return {
        type: RECEIVE_SCHEDULE,
        schedule: schedule,
        generating: false,
        scheduleScreen: true
    }
}

export const SET_UID = "SET_UID";
export function setUID(uid) {
    return {
        type: SET_UID,
        uid: uid,
    }
}

export function getSchedule(scheduleList) {
    return function(dispatch) {
        dispatch(requestSchedule);

        return generateSchedule(scheduleList)
            .then((schedule) => dispatch(receiveSchedule(schedule)))
    }
}

export const PLAN_SCHEDULE = "PLAN_SCHEDULE";
export function returnToPlanning() {
    return {
        type: PLAN_SCHEDULE,
        scheduleScreen: false,
    }
}