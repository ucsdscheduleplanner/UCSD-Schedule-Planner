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
    this.data = data;
    this.timeInterval = makeTimeInterval.call(this);
    this.day = data['DAYS'];
    this.timeInterval['start'].setDate(dayToNum[this.day]);
    this.timeInterval['end'].setDate(dayToNum[this.day]);

    function makeTimeInterval() {
        let timeInterval = {};
        timeInterval['start'] = moment(data['TIME'][0], date_string).toDate();
        timeInterval['end'] = moment(data['TIME'][1], date_string).toDate();
        return timeInterval;
    }

    this.getType = function () {
        return this.data['TYPE'];
    };

    this.getTimeInterval = function () {
        return this.timeInterval;
    };

    this.overlaps = function (other) {
        return TimeHeuristic.prototype.overlaps(this.getTimeInterval(), other.getTimeInterval());
    };

    this.toString = function() {
        return this.data['COURSE_NUM'] + " " + this.data['TYPE'];
    }
}

export function Class(data) {
    this.subclasses = {};
    this.timeIntervals = [];
    this.allSubclasses = [];

    data.forEach((subclass_data) => {
        let subclass = new Subclass(subclass_data);
        let subclass_type = subclass.getType();

        this.allSubclasses.push(subclass);
        if (this.subclasses[subclass_type] === undefined) {
            this.subclasses[subclass_type] = [];
        }
        this.subclasses[subclass_type].push(subclass);
    });

    Object.entries(this.subclasses).forEach(function ([key, value]) {
        value.forEach(function (cl) {
            this.timeIntervals.push(cl.getTimeInterval());
        }, this);
    }, this);

    this.getTimeIntervals = function () {
        return this.timeIntervals;
    };

    this.overlaps = function (other) {
        for(let subclass of this.allSubclasses) {
            for(let otherSubclass of other.allSubclasses) {
                if(this.conflicts.includes(subclass.getType())
                || other.conflicts.includes(otherSubclass.getType())) continue;

                //TODO keep functions out of subclass and put them in an array or PQ
                if(subclass.overlaps(otherSubclass)) return true;
            }
        }
        return false;
    };
}

