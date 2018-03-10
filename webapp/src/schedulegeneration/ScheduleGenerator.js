import {Class} from '../utils/ClassUtils.js';
import {Heap} from '../utils/Heap.js';
import TimeHeuristic from '../heuristics/TimeHeuristic.js';
import {BACKENDURL} from "../settings";

function requestData(selectedClasses) {
    return new Promise((resolve, reject) => {
        fetch(`${BACKENDURL}/data`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(selectedClasses)
        })
            .then(res => res.json())
            .then(res => {
                resolve(res);
            })
            .catch(error => reject(error));
    });
}

/**
 * Converts the data from returned server data to usable data
 * @param selectedClasses json for classes
 * @param dirtyClassData the data we received from the server
 * @returns {Promise} cleaned up data
 */
function handleData(selectedClasses, dirtyClassData) {
    let classData = {};
    selectedClasses.forEach((_class) => {
        let classGroup = _class['class'];
        let conflicts = _class['conflicts'];
        dirtyClassData[classGroup].forEach((class_data) => {
            let new_class = new Class(class_data);
            new_class['conflicts'] = conflicts;
            if (classData[classGroup] === undefined) {

                TimeHeuristic.prototype.timeRange = {
                    "start": new Date("Mon, 01 Jan 1900 10:00:00"),
                    "end": new Date("Mon, 01 Jan 1900 17:00:00")
                };

                classData[classGroup] = new Heap(TimeHeuristic.prototype.compare);
            }
            classData[classGroup].add(new_class);
        });
    });

    Object.entries(classData).forEach(function ([key, val]) {
        console.log(key);
        val.print()
    });

    console.log("Results");
    return new Promise((resolve, reject) => {
        try {
            resolve(classData);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Interfacing function that generates a schedule.
 * @param selectedClasses the classes we want to make a schedule out of
 * @returns {Promise} a promise that will resolve to a schedule
 */
export function generateSchedule(selectedClasses) {
    // making the JSON here for the request
    let selectedClassesJSON = {};
    selectedClassesJSON['classes'] = selectedClasses.map((cl) => cl['class']);

    return new Promise((resolve, reject) => {
        requestData(selectedClassesJSON)
        // with the data we handle it
            .then(dirtyClassData => handleData(selectedClasses, dirtyClassData)
            // with the cleaned data we resolve it by returning our schedule
                // turns them into heaps
                .then(classHeaps => resolve(getSchedule(classHeaps))))
            .catch(error => reject(error))
            .catch(error => reject(error))
    });
}


// actual generation part
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

/**
 * Generates a schedule given a list of classes in heap form
 * @param classHeaps the heaps for each class
 * @returns {Array} the desired schedule
 */
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

