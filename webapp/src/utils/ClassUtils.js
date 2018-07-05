import moment from 'moment';
import TimeHeuristic from '../heuristics/TimeHeuristic.js';

const dayToNum = {
    "M": 1,
    "Tu": 2,
    "W": 3,
    "Th": 4,
    "F": 5,
    "Sa": 6,
    "Su": 7
};

const date_string = "ddd, DD MMM YYYY HH:mm:ss";

export function Subclass(data) {
    this.location = data['LOCATION'];
    this.room = data['ROOM'];
    this.instructor = data['INSTRUCTOR'];
    this.id = data['ID'];
    this.courseNum = data['COURSE_NUM'];
    this.department = data['DEPARTMENT'];
    this.type = data['TYPE'];
    this.day = data['DAYS'];

    this.timeInterval = makeTimeInterval.call(this);
    this.timeInterval['start'].setDate(dayToNum[this.day]);
    this.timeInterval['end'].setDate(dayToNum[this.day]);

    function makeTimeInterval() {
        let timeInterval = {};
        timeInterval['start'] = moment(data['TIME'][0], date_string).toDate();
        timeInterval['end'] = moment(data['TIME'][1], date_string).toDate();
        return timeInterval;
    }

    this.overlaps = function (other) {
        return TimeHeuristic.prototype.overlaps(this.timeInterval, other.timeInterval);
    };

    this.toString = function () {
        return this.courseNum + " " + this.type;
    }
}

export function Class(data) {
    this.course_num = data['COURSE_NUM'];
    this.department = data['DEPARTMENT'];
    this.instructor = data['INSTRUCTOR'];
    this.class_title = `${this.department} ${this.course_num}`;
    this.subclasses = {};
    this.timeIntervals = [];
    this.subclassList = [];

    data['subclasses'].forEach((subclass_data) => {
        let subclass = new Subclass(subclass_data);
        let subclass_type = subclass.type;
        // handle case for final
        if (subclass_type !== 'FI') {
            this.subclassList.push(subclass);
            if (this.subclasses[subclass_type] === undefined) {
                this.subclasses[subclass_type] = [];
            }
            this.subclasses[subclass_type].push(subclass);
        }
    });

    Object.entries(this.subclasses).forEach(function ([key, value]) {
        value.forEach(function (cl) {
            this.timeIntervals.push(cl.timeInterval);
        }, this);
    }, this);

    this.overlaps = function (other) {
        for (let subclass of this.subclassList) {
            for (let otherSubclass of other.subclassList) {
                if (this.conflicts.includes(subclass.type)
                    || other.conflicts.includes(otherSubclass.type)) continue;

                //TODO keep functions out of subclass and put them in an array or PQ
                if (subclass.overlaps(otherSubclass)) return true;
            }
        }
        return false;
    };

    this.toString = function () {
        return this.name;
    }
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
    function makeTimeInterval() {
        let timeInterval = {};
        // first element is start, second is end
        let splitTime = this.time.split("-");

        // if it failed to split
        if(splitTime.length === 1) {
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
        dayToSet = dayToNum[this.day];
        dist = calculateDistanceFrom(currentDay, dayToSet);
        startTime.setDate(startTime.getDate() + dist);

        let endTime = moment(splitTime[1], TIME_STRING).toDate();
        dayToSet = dayToNum[this.day];
        dist = calculateDistanceFrom(currentDay, dayToSet);
        endTime.setDate(endTime.getDate() + dist);

        timeInterval['start'] = startTime;
        timeInterval['end'] = endTime;
        return timeInterval;
    }

    function calculateDistanceFrom(currentDay, dayToSet) {
        return (dayToSet - currentDay) % 7;
    }
}
