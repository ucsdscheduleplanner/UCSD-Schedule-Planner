import moment from 'moment';
const TIME_STRING = "HH:mm";

const dayToNum = {
    "M": 1,
    "Tu": 2,
    "W": 3,
    "Th": 4,
    "F": 5,
    "Sa": 6,
    "Su": 7
};

function calculateDistanceFrom(currentDay, dayToSet) {
    return (dayToSet - currentDay) % 7;
}

/**
 * Thin wrapper over date object to support time manipulation with days easier
 */
export class DayTime {
    constructor(time = null, day = null) {
        this.time = time;
        this.day = day;
    }

    setTime(time) {
        this.time = time;
    }

    setDay(day) {
        this.day = day;
    }

    /**
     * Builds a date object based off the field
     * @returns {Date} returns the date set with the day and time
     */
    getDate() {
        let ret = new Date();

        // setting the correct day
        if (this.day) {
            let currentDate = new Date();
            let currentDay = currentDate.getDay();
            let dayToSet = dayToNum[this.day];
            let dist = calculateDistanceFrom(currentDay, dayToSet);
            ret.setDate(ret.getDate() + dist);
        }

        if (this.time) {
            // always set the seconds to 0
            ret.setHours(this.time.getHours(), this.time.getMinutes(), 0);
        }
        return ret;
    }
}

export class TimeBuilder {

    constructor() {
        this.date = new Date();
        this.date.setHours(0, 0, 0);
    }

    withHour(hour) {
        this.date.setHours(hour);
        return this;
    }

    withMinutes(minutes) {
        this.date.setMinutes(minutes);
        return this;
    }

    build() {
        return this.date;
    }
}

// we define time interval here as including a day as well
export function makeTimeInterval(time, day) {
    let timeInterval = {};
    // first element is start, second is end
    let splitTime = time.split("-");

    // if it failed to split
    if (splitTime.length === 1) {
        //timeInterval['start'] = new Date(1990, 1, 1);
        //timeInterval['end'] = new Date(1990, 1, 1);
        // let the caller know that no timeInterval was created
        return null;
    }

    // convert to javascript date first
    let start = moment(splitTime[0], TIME_STRING).toDate();
    let end = moment(splitTime[1], TIME_STRING).toDate();

    timeInterval['start'] = new DayTime(start, day).getDate();
    timeInterval['end'] = new DayTime(end, day).getDate();
    return timeInterval;
}