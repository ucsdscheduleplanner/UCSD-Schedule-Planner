export function PriorityModifier(Class = null) {
    this.Class = Class;
    this.classTitle = Class.classTitle;
    // list of different preference objects
    this.preferences = [];
    this.priority = 1;

    this.evaluate = function (classToEvaluate) {
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
        if(classToEvaluate.length === 0) {
            return 0;
        }

        let subsection = classToEvaluate[0];
        if (subsection.classTitle === Class.classTitle) {
            if (subsection.instructor === Class.instructor) {
                return 10;
            }
            return -3;
        }
    }
}