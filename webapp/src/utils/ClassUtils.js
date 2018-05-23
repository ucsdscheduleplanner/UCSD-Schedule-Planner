import moment from 'moment';
import momenttz from 'moment-timezone';
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

momenttz().tz("America/Los_Angeles").format();

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

    this.toString = function() {
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

        this.subclassList.push(subclass);
        if (this.subclasses[subclass_type] === undefined) {
            this.subclasses[subclass_type] = [];
        }
        this.subclasses[subclass_type].push(subclass);
    });

    Object.entries(this.subclasses).forEach(function ([key, value]) {
        value.forEach(function (cl) {
            this.timeIntervals.push(cl.timeInterval);
        }, this);
    }, this);

    this.overlaps = function (other) {
        for(let subclass of this.subclassList) {
            for(let otherSubclass of other.subclassList) {
                if(this.conflicts.includes(subclass.type)
                || other.conflicts.includes(otherSubclass.type)) continue;

                //TODO keep functions out of subclass and put them in an array or PQ
                if(subclass.overlaps(otherSubclass)) return true;
            }
        }
        return false;
    };

    this.toString = function() {
        return this.name;
    }
}

