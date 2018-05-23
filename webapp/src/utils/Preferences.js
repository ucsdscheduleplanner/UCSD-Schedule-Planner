export function PriorityPreference(priority) {
    return function(classToEvaluate) {
        return 1;
    }
}

export function InstructorPreference(Class, instructor) {
    this.Class = Class;
    this.instructor = instructor;

    return function(classToEvaluate) {
        if(Class.class_title === classToEvaluate.class_title) {
            if(Class.instructor === classToEvaluate.instructor) {
                return 10;
            }
            return -3;
        }
    }
}