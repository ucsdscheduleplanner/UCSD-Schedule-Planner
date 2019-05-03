import {makeTimeInterval} from "../time/TimeUtils";

// wrapper over the information returned from the backend
// a copy constructor for the data fetched
export class Subsection {
  // has information about the specific subsection, LE, DI

    constructor(subsection) {
        console.log(subsection)
        const {days, time, instructor, location, room, type} = subsection;
        this.day = days;
        this.timeInterval = makeTimeInterval(time, this.day);
        this.type = type;
        this.instructor = instructor;
        this.location = location;
        this.room = room;
    }
}
