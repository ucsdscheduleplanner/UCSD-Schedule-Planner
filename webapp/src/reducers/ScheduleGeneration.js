/**
 Should be able to access this through state.ScheduleGeneration
 **/

import {generateSchedule} from "../schedulegeneration/ScheduleGenerator";

export default function ScheduleGeneration(state = {enableCalendar: false,
                                                    calendarError: false,
                                                    schedule: []}, action) {
    switch (action.type) {
        case "GENERATE_SCHEDULE":
            let newState = Object.assign({}, state);
            newState.enableCalendar = false;
            newState.calendarError = false;
            newState.schedule = [];


            break;
        default:
            return state;
    }
}