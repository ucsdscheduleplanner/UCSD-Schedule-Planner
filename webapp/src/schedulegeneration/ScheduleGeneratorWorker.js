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

function isValid(newClass, conflicts, intervalTree) {
    let addedIntervals = [];
    for (let subclass of newClass.subclassList) {
        let timeInterval = subclass.timeInterval;
        // if we have a conflict, that means we don't care so don't add to the tree
        if(conflicts[newClass.class_title] && conflicts[newClass.class_title].includes(subclass.type)) {
            continue;
        }
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

function _dfs(classData, currentSchedule, intervalTree, schedules, conflicts, evaluateSchedule, counter) {
    if (currentSchedule.length >= classData.length) {
        let score = evaluateSchedule(currentSchedule);
        schedules.push([score, currentSchedule]);
        return currentSchedule;
    }

    let currentClassGroup = classData[counter];
    for (let i = 0; i < currentClassGroup.length; i++) {
        let currentClass = currentClassGroup[i];
        if (isValid(currentClass, conflicts, intervalTree)) {
            currentSchedule.push(currentClass);
            _dfs(classData, currentSchedule, intervalTree, schedules, conflicts, evaluateSchedule, counter + 1);
            for (let j = counter; j < currentSchedule.length; j++) {
                currentSchedule[j].timeIntervals.forEach(timeInterval => intervalTree.remove(timeInterval));
            }
            currentSchedule = currentSchedule.slice(0, counter);
        }
    }
}

function dfs(classData, conflicts, evaluateSchedule) {
    let schedules = [];
    _dfs(classData, [], new SimpleIntervalTree(), schedules, conflicts, evaluateSchedule, 0);
    schedules = schedules.sort((scheduleArr1, scheduleArr2) => {
        if (scheduleArr1[0] > scheduleArr2[0]) return -1; else return 1;
    });
    if (schedules.length > 0) {
        return schedules[0][1];
    } else {
        return null;
    }
}

export async function generateScheduleWorker(selectedClasses, conflicts = [], preferences = []) {
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
        classData[counter++] = ClassGroupJSON.map((ClassGroup) => new Class(ClassGroup));
    });
    // now we have an array where each index is a Class Group
    // we can start brute force dfs now

    let evaluateSchedule = (schedule) => {
        return preferences.reduce((accumulator, evaluator) => {
            return accumulator +
                schedule.reduce((classAccum, Class) => {
                    return classAccum + evaluator.evaluate(Class)
                }, 0);
        }, 0);
    };

    return dfs(classData, conflicts, evaluateSchedule);
}

export function hello(a, b) {
    return a + b;
}

