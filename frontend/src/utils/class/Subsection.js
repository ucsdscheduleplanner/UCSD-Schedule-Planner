import {makeTimeInterval} from "../time/TimeUtils";

// wrapper over the information returned from the backend
// a copy constructor for the data fetched
export class Subsection {
  // has information about the specific subsection, LE, DI

    constructor(subsection) {
        const {DAYS, TIME, INSTRUCTOR, LOCATION, ROOM, TYPE} = subsection;
        this.day = DAYS;
        this.timeInterval = makeTimeInterval(TIME, this.day);
        this.type = TYPE;
        this.instructor = INSTRUCTOR;
        this.location = LOCATION;
        this.room = ROOM;
    }
}
