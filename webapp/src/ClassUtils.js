import moment from 'moment';
import momenttz from 'moment-timezone';
import {overlaps} from './TimeHeuristic.js';

momenttz().tz("America/Los_Angeles").format();

const date_string = "ddd, DD MMM YYYY HH:mm:ss";

export function Subclass(data) {
    this.data = data;
    this.timeInterval = makeTimeInterval.call(this);


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

    this.overlaps = function(other) {
        return overlaps(this.getTimeInterval(), other.getTimeInterval());
    }
}

export function Class(data) {
    this.subclasses = {};
    this.timeIntervals = [];

    data.forEach((subclass_data) => {
        let subclass = new Subclass(subclass_data);
        let subclass_type = subclass.getType();

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

    this.overlaps = function(other) {
        Object.values(this.subclasses).forEach((subclasses) => {
            // could have error here
          Object.values(other.subclasses).forEach((otherSubclasses) => {
              subclasses.forEach((subclass)=> {
                 otherSubclasses.forEach((otherSubclass) => {
                     if(subclass.overlaps(otherSubclass)) return true;
                 });
              });
          });
        });
        return false;
    };
}

