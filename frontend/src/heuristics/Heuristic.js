let Heuristic = {};
Heuristic.prototype  = Object.create(Object.prototype);

Heuristic.prototype.evaluateClass = function (myClass) {
    return -1;
};

Heuristic.prototype.evaluateSchedule = function (schedule) {
    return -1;
};

/*
expects two dictionaries of the form
start: date object
end: date object
 */
Heuristic.prototype.overlaps = function overlaps(time1, time2) {
    // must make sure to check for day equality as well
    return (time1['start'].getDay() === time2['start'].getDay())
        && (time1['start'] <= time2['end'])
        && (time2['start'] <= time1['end']);
};

Heuristic.prototype.overlapsTimeRange = function overlapsTimeRange(time1, timeRange) {
    return (time1['start'] <= timeRange['end'])
        && (timeRange['start'] <= time1['end']);
};

export default Heuristic;
