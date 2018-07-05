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
        for(let subsection of classToEvaluate) {
            // one has different name I know it is bad
            if(subsection.classTitle === Class.class_title) {
                if (subsection.instructor === Class.instructor) {
                    return 10;
                }
                return -3;
            }
        }
    }
}