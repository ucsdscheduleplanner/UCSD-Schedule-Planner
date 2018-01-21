
function isValid(newClass, schedule) {
    schedule.forEach((classInSchedule) => {
        if(classInSchedule.overlaps(newClass)) return false;
    });
    return true;
}

function swap(index1, index2, l) {
    let temp = l[index1];
    l[index1] = l[index2];
    l[index2] = temp;
}

export function getSchedule(classHeaps) {
    let workingClassHeaps = Object.values(classHeaps);
    let retSchedule = {};
    for (let curStart = 0; curStart < workingClassHeaps.length; curStart++) {
        let curSchedule = [];
        workingClassHeaps = Object.values(classHeaps);

        workingClassHeaps.forEach((heap, index)=> {
            workingClassHeaps[index] = heap.copy();
        });

        // bringing the new first class to the front of the list
        swap(curStart, 0, workingClassHeaps);

        let curIndex = 0;
        while (curSchedule.length < workingClassHeaps.length) {
            if(workingClassHeaps[curIndex].isEmpty()) throw new TypeError("No schedule is possible");
            if (isValid(workingClassHeaps[curIndex].peek(), curSchedule)) {
                curSchedule.push(workingClassHeaps[curIndex].removeRoot());
                curIndex++;
            } else {
                workingClassHeaps[curIndex].removeRoot();
            }
        }
        retSchedule = curSchedule;
    }
    return retSchedule;
}