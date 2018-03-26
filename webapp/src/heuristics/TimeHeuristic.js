import Heuristic from "./Heuristic";

let TimeHeuristic = {};
TimeHeuristic.prototype = Object.create(Heuristic.prototype);

TimeHeuristic.prototype.evaluateSchedule = function evaluateSchedule(schedule) {
    if (schedule.length <= 0) return -100;
    let score = 0;
    schedule.forEach((class1) => {
        score += class1['score'];
    });
    return score;
};

// takes in two class objects
TimeHeuristic.prototype.compare = function compare(class1, class2) {
    let class1Score = 0;
    let class2Score = 0;

    if (!('score' in class1)) class1['score'] = TimeHeuristic.prototype.evaluateClass(class1);
    class1Score = class1['score'];

    if (!('score' in class2)) class2['score'] = TimeHeuristic.prototype.evaluateClass(class2);
    class2Score = class2['score'];

    if (class1Score > class2Score) return -1;
    else if (class2Score > class1Score) return 1;
    else return 0;
};

TimeHeuristic.prototype.evaluateClass = function evaluateClass(class1) {
    let score = 0;
    class1.timeIntervals.forEach((subclassInterval) => {
        if (this.overlapsTimeRange(TimeHeuristic.prototype.timeRange, subclassInterval)) {
            score += 1;
        } else {
            score -= 1;
        }
    });
    return score;
};

export default TimeHeuristic;
