export function PriorityModifier(Class = null, preferences, priority) {
    this.Class = Class;
    this.classTitle = Class.classTitle;
    // list of different preference objects
    this.preferences = preferences;
    this.priority = priority;

    return (classToEvaluate) => {
        let score = 0;
        for (let preferenceFunction of this.preferences) {
            score = this.priority * (score + preferenceFunction(classToEvaluate));
        }
        return score;
    }
}

export function InstructorPreference(Class, instructor) {
    this.Class = Class;
    this.classTitle = Class.classTitle;
    this.instructor = instructor;

    // should get this because arrow function takes closest scope
    return (classToEvaluate) => {
        if (classToEvaluate.length === 0) {
            return 0;
        }

        // can just get the first one because we are only looking at instructors
        // and they all have the same instructor
        let subsection = classToEvaluate[0];
        if (subsection.classTitle === Class.classTitle) {
            if (subsection.instructor === Class.instructor) {
                return 10;
            }
            return -3;
        }
    }
}

/**
 * Because this is a general schedule preference we don't need any specific classes
 * @constructor
 * @param start
 * @param end
 */
export function TimePreference(start, end) {
    this.start = new Date();
    this.start.setHours(start.getHours(), start.getMinutes(), 0);

    this.end = new Date();
    this.end.setHours(end.getHours(), end.getMinutes(), 0);

    return (classToEvaluate) => {
        if (classToEvaluate.length === 0) {
            return 0;
        }

        let score = 0;
        for (let subsection of classToEvaluate) {
            // this shouldn't happen but if it does punish hardcore
            if (!subsection.timeInterval) {
                score -= 999;
                break;
            }

            let tempStart = subsection.timeInterval["start"];
            let tempEnd = subsection.timeInterval["end"];

            let rangeStart = new Date();
            rangeStart.setHours(tempStart.getHours(), tempStart.getMinutes(), 0);

            let rangeEnd = new Date();
            rangeEnd.setHours(tempEnd.getHours(), tempEnd.getMinutes(), 0);

            // they overlap!
            if(rangeStart <= this.end && rangeEnd >= this.start) {
                score += 10;
                // the range is inside our desired range!
                if(rangeStart => this.start && rangeEnd <= this.end) {
                    score += 20;
                }
            }
        }
        return score;
    }
}

export function DayPreference(days) {
    this.days = days;

    return (classToEvaluate) => {
        if(classToEvaluate.length === 0){
            return 0;
        }
        let score = 0;
        for(let subsection of classToEvaluate) {
            if(!subsection.day) {
                score += -10;
            }
            if(this.days.includes(subsection.day)) {
                score += 20;
            }
            score += -5;
        }
        return score;
    }
}