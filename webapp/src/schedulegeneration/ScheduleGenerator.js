import {Class} from '../utils/ClassUtils.js';
import {Heap} from '../utils/Heap.js';
import TimeHeuristic from '../heuristics/TimeHeuristic.js';
import {BACKEND_URL} from "../settings";

function requestData(selectedClasses) {
    let url = BACKEND_URL;
    return new Promise((resolve, reject) => {
        console.log(url);
        fetch(`${url}/api_data`, {
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
 * @returns {Promise} cleaned up data in a dictionary form where each key is the name
 * of a class and the value is a heap containing all the classes
 */
function handleData(selectedClasses, dirtyClassData) {
    // using object here to define each class heap by its class
    let classData = {};
    selectedClasses.forEach((_class) => {
        let classGroup = _class['class_title'];
        let conflicts = _class['conflicts'];
        dirtyClassData[classGroup].forEach((class_data) => {
            let new_class = new Class(class_data);
            // giving the name to identify it
            new_class.name = classGroup;
            new_class['conflicts'] = conflicts;
            if (classData[classGroup] === undefined) {

                // time range is used in the evaluate class method of time heuristic
                TimeHeuristic.prototype.timeRange = {
                    "start": new Date("Mon, 01 Jan 1900 10:00:00"),
                    "end": new Date("Mon, 01 Jan 1900 17:00:00")
                };

                // Heap constructor takes in comparator function so we use the time heuristic one
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
 * @param selectedClasses the classes in dict form we want to make a schedule out of
 * @returns {Promise} a promise that will resolve to a schedule
 */
export function generateSchedule(selectedClasses) {
    selectedClasses = Object.values(selectedClasses);
    // making the JSON here for the request
    let selectedClassesJSON = {};
    selectedClassesJSON['classes'] = selectedClasses.map((cl) =>  {
            return {
                class_title: cl['class_title'],
                course_num: cl['course_num'],
                department: cl['department']
            };
    });

    return new Promise((resolve, reject) => {
        requestData(selectedClassesJSON)
        // with the data we handle it
            .then(dirtyClassData => handleData(selectedClasses, dirtyClassData)
            // with the cleaned data we resolve it by returning our schedule
                // turns them into heaps
                // we manually convert to array of heaps when passing in because getSchedule
                // does not need a dict
                .then(classHeaps => resolve(getSchedule(Object.values(classHeaps)))))
            .catch(error => reject(error))
            .catch(error => reject(error))
    });
}

// for now makes sure they do not overlap and considers conflicts
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
 * @param classHeaps the heaps for each class in array form
 * Each element in the array is a heap containing all the class sections for the specific class.
 * IMPORTANT classHeaps will not be altered at all
 * @returns {Array} the desired schedule
 */
export function getSchedule(classHeaps) {
    let retSchedule = [];

    // curStart will be defined as the index of the class that we put down first
    // in our new schedule
    for (let curStart = 0; curStart < classHeaps.length; curStart++) {
        let curSchedule = [];
        // numClasses is the number of classes in correct schedule
        let numClasses = classHeaps.length;

        // defining the array of heaps we will be working with
        let workingClassHeaps = [];

        // copying the heap into the array we are working with
        classHeaps.forEach((heap, index) => {
            workingClassHeaps[index] = heap.copy();
        });

        // bringing the new first class to the front of the list
        swap(curStart, 0, workingClassHeaps);

        // curIndex is the number of classes we have in our current schedule
        // also holds the index of the current class we are trying to add to the schedule
        let curIndex = 0;

        // we go until we have the number of desired classes
        while (curIndex < numClasses) {
            // if a heap is empty that means this current schedule cannot work and we break
            if (workingClassHeaps[curIndex].isEmpty()) break;

            // add it to the schedule if it is valid and advance one class ahead
            // because of the heap ordering, we are guaranteed the best class so far
            if (isValid(workingClassHeaps[curIndex].peek(), curSchedule)) {
                curSchedule.push(workingClassHeaps[curIndex].removeRoot());
                curIndex++;
            } else {
                // otherwise we remove the current class and consider the next one in the heap
                workingClassHeaps[curIndex].removeRoot();
            }
        }

        // making sure the schedule is actually valid by comparing
        // num classes in each schedule
        if(curSchedule.length !== numClasses) continue;

        // evaluate the schedule to find our best schedule
        if (TimeHeuristic.prototype.evaluateSchedule(curSchedule) >
            TimeHeuristic.prototype.evaluateSchedule(retSchedule)) {
            retSchedule = curSchedule;
        }
    }
    // if our best schedule is empty then we have no best schedule
    // we are guaranteed that we will either get a valid schedule or a schedule with no elements
    // because we do not consider any schedules with not enough elements
    if(retSchedule.length === 0) return new TypeError("No schedule is possible!");
    return retSchedule;
}

