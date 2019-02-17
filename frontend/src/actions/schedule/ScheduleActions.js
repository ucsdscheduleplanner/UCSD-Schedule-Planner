export const SET_CURRENT_SCHEDULE = "SET_CURRENT_SCHEDULE";
export const SET_CLASS_DATA = "SET_CLASS_DATA";
export const SET_SCHEDULE_MODE = "SET_SCHEDULE_MODE";


export function setCurrentSchedule(currentSchedule) {
    return {
        type: SET_CURRENT_SCHEDULE,
        currentSchedule: currentSchedule
    }
}

export function setClassData(classData) {
    return {
        type: SET_CLASS_DATA,
        classData: classData
    }
}

export function setScheduleMode(mode) {
    return {
        type: SET_SCHEDULE_MODE,
        scheduleMode: mode
    }
}
