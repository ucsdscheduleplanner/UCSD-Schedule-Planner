import moment from 'moment';

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

    let currentDate = new Date();
    let currentDay = currentDate.getDay();
    let dist, dayToSet;

    // convert to javascript date first
    let startTime = moment(splitTime[0], TIME_STRING).toDate();
    dayToSet = dayToNum[day];
    dist = calculateDistanceFrom(currentDay, dayToSet);
    startTime.setDate(startTime.getDate() + dist);

    let endTime = moment(splitTime[1], TIME_STRING).toDate();
    dayToSet = dayToNum[day];
    dist = calculateDistanceFrom(currentDay, dayToSet);
    endTime.setDate(endTime.getDate() + dist);

    timeInterval['start'] = startTime;
    timeInterval['end'] = endTime;
    return timeInterval;
}

/*
Every class has subsections, these would be the LE, DI, and LAs of classes. Each LE is split into a subsection
so for every day of a section you would have your own subsection. For example a LE on MWF, would have 3 subsections
for M W and F
 */
const TIME_STRING = "HH:mm";

export function Subsection(data) {
    // data is a dictionary with all the information about the class
    // converting to better javascript names
    ({
        COURSE_ID: this.courseID,
        COURSE_NUM: this.courseNum,
        DAYS: this.day,
        DEPARTMENT: this.department,
        DESCRIPTION: this.description,
        INSTRUCTOR: this.instructor,
        LOCATION: this.roomLocation,
        ROOM: this.room,
        SECTION_ID: this.sectionID,
        TIME: this.time,
        TYPE: this.type
    } = data);

    this.classTitle = `${this.department} ${this.courseNum}`;
    this.location = `${this.roomLocation} ${this.room}`;
    // will convert the time and day to a time interval object
    this.timeInterval = makeTimeInterval.call(this);

    /*
    A function to convert time and date strings into the correct time intervals.
     */

}
