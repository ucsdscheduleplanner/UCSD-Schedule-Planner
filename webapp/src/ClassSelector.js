import TimeHeuristic from "./TimeHeuristic.js";


function isValid(newClass, schedule) {
    for (let classInSchedule of schedule) {
        if (classInSchedule.overlaps(newClass)) return false;
    }
    return true;
}

function swap(index1, index2, myList) {
    let temp = myList[index1];
    myList[index1] = myList[index2];
    myList[index2] = temp;
}

export function getSchedule(classHeaps) {
    let workingClassHeaps = Object.values(classHeaps);
    let retSchedule = [];
    for (let curStart = 0; curStart < workingClassHeaps.length; curStart++) {
        let curSchedule = [];
        workingClassHeaps = Object.values(classHeaps);

        // copying the heap each time
        workingClassHeaps.forEach((heap, index) => {
            workingClassHeaps[index] = heap.copy();
        });

        // bringing the new first class to the front of the list
        swap(curStart, 0, workingClassHeaps);

        let curIndex = 0;
        while (curSchedule.length < workingClassHeaps.length) {
            if (workingClassHeaps[curIndex].isEmpty()) throw new TypeError("No schedule is possible");
            if (isValid(workingClassHeaps[curIndex].peek(), curSchedule)) {
                curSchedule.push(workingClassHeaps[curIndex].removeRoot());
                curIndex++;
            } else {
                workingClassHeaps[curIndex].removeRoot();
            }
        }
        if (TimeHeuristic.prototype.evaluateSchedule(curSchedule) >
            TimeHeuristic.prototype.evaluateSchedule(retSchedule)) {
            retSchedule = curSchedule;
        }
    }
    return retSchedule;
}