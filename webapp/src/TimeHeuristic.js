/*
expects two dictionaries of the form
start: date object
end: date object
 */
export function overlaps(time1, time2) {
    return (time1['start'] <= time2['end']) && (time2['start'] <= time1['end']);
}

export function TimeHeuristic(timeRange) {
    this.timeRange = timeRange;

    // takes in two class objects
    this.getOutput = function (class1, class2) {
        if (evaluate(class1) > evaluate(class2)) return -1;
        else if (evaluate(class2) > evaluate(class1)) return 1;
        else return 0;
    };

    function evaluate(class1) {
        let score = 0;
        class1.getTimeIntervals().forEach((subclassInterval) => {
            if (overlaps(timeRange, subclassInterval)) {
                score += 1;
            } else {
                score -= 1;
            }
        });
        return score;
    }
}
