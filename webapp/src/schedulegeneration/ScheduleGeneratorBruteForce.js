import {BACKEND_URL} from "../settings";
import {SimpleIntervalTree} from "../utils/SimpleIntervalTree";
import {Class} from "../utils/ClassUtils";

async function requestData(selectedClasses) {
    let response = await fetch(`${BACKEND_URL}/api_data`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify(selectedClasses)
    });
    return await response.json();
}

function isValid(newClass, intervalTree) {
    let addedIntervals = [];
    for (let timeInterval of newClass.timeIntervals) {
        addedIntervals.push(timeInterval);
        if (!intervalTree.add(timeInterval)) {
            // removing intervals we have added
            // making sure no side effects if unsuccessful
            addedIntervals.map((interval) => intervalTree.remove(interval));
            return false;
        }
    }
    return true;
}

function evaluateSchedule(schedule1, schedule2) {
    return 1;
}

function _dfs(classData, currentSchedule, intervalTree, schedules, counter) {
    if (currentSchedule.length >= classData.length) {
        schedules.push(currentSchedule);
        return currentSchedule;
    }

    let currentClassGroup = classData[counter];
    for (let i = 0; i < currentClassGroup.length; i++) {
        let currentClass = currentClassGroup[i];
        if (isValid(currentClass, intervalTree)) {
            currentSchedule.push(currentClass);
            _dfs(classData, currentSchedule, intervalTree, schedules, counter + 1);
            for (let j = counter; j < currentSchedule.length; j++) {
                currentSchedule[j].timeIntervals.forEach(timeInterval => intervalTree.remove(timeInterval));
            }
            currentSchedule = currentSchedule.slice(0, counter);
        }
    }
}

function dfs(classData) {
    let schedules = [];
    _dfs(classData, [], new SimpleIntervalTree(), schedules, 0);
    return schedules[0];
}

export async function generateSchedule(selectedClasses) {
    selectedClasses = Object.values(selectedClasses);
    // making the JSON here for the request
    let selectedClassesJSON = {};
    selectedClassesJSON['classes'] = selectedClasses;
    // class data is an object where each field is the name of a class and everything inside it
    // is a class with its times and such
    let classJSON = await requestData(selectedClassesJSON);
    let classData = [];
    // counter of where we are in the dfs
    let counter = 0;

    Object.keys(classJSON).forEach((ClassGroupsKey) => {
        // class group is an array of all the different sections that are the same class
        let ClassGroupJSON = classJSON[ClassGroupsKey];
        // ClassGroupsKey is the name of the class
        classData[counter++] = ClassGroupJSON.map((ClassGroup) => new Class(ClassGroupsKey, ClassGroup));
    });
    // now we have an array where each index is a Class Group
    // we can start brute force dfs now

    return dfs(classData);
}


