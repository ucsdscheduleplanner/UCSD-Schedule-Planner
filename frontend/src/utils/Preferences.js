export function PriorityModifier(classTitle, preferences, priority) {
    this.classTitle = classTitle;
    // list of different preference objects
    this.preferences = preferences;
    this.priority = priority;

    this.type = "PRIORITY";
}

export function InstructorPreference(instructor) {
    this.instructor = instructor;

    this.type = "INSTRUCTOR";
}

/**
 * Because this is a general generationResult preference we don't need any specific classes
 * @constructor
 * @param start
 * @param end
 */
export function TimePreference(start, end) {
    this.start = new Date();
    this.start.setHours(start.getHours(), start.getMinutes(), 0);

    this.end = new Date();
    this.end.setHours(end.getHours(), end.getMinutes(), 0);

    this.type = "TIME";
}

export function DayPreference(days) {
    this.days = days;

    this.type = "DAY";
}