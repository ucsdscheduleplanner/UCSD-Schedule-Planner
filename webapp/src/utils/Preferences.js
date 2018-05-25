export function PriorityModifier(Class = null) {
    this.Class = Class;
    this.preferences = [];
    this.priority = 1;

    this.evaluate = function (classToEvaluate) {
        return this.preferences.reduce((accumulator, evaluate) => {
            return this.priority * (accumulator + evaluate(classToEvaluate));
        }, 0);
    }
}

export function InstructorPreference(Class, instructor) {
    this.Class = Class;
    this.instructor = instructor;

    return function (classToEvaluate) {
        if (Class.class_title === classToEvaluate.class_title) {
            if (Class.instructor === classToEvaluate.instructor) {
                return 10;
            }
            return -3;
        }
    }
}