import {BACKEND_URL} from "../settings";
import {SimpleIntervalTree} from "../utils/SimpleIntervalTree";
import {Class} from "../utils/ClassUtils";
import {generateSchedule} from "./ScheduleGenerator";

async function requestDirtyData(selectedClasses) {
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

// dirty class data is a list
function cleanData(dirtyClassData) {
    let ret = {};
    Object.keys(dirtyClassData).map(courseName => {
        ret[courseName] = [];
        let currentList = null;
        let currentSection = null;

        let slowPtr = 0;
        let fastPtr = 0;

        let copyCourseData = dirtyClassData[courseName].slice();
        copyCourseData.push({"SECTION_ID": null});

        while(fastPtr < copyCourseData.length) {
            let slowSectionID = copyCourseData[slowPtr]["SECTION_ID"];
            let fastSectionID = copyCourseData[fastPtr]["SECTION_ID"];

            if (slowSectionID !== fastSectionID) {
                // inclusive exclusive for bounds
                ret[courseName].push(copyCourseData.slice(slowPtr, fastPtr));
                slowPtr = fastPtr;
            }

            fastPtr++;
        }
    });
    // no alterations to input
    return ret;
}

export function ScheduleGenerationBruteForce() {
    this.isValid = function(newClass, conflicts, intervalTree) {
        let addedIntervals = [];
        for (let subclass of newClass.subclassList) {
            let timeInterval = subclass.timeInterval;
            // if we have a conflict, that means we don't care so don't add to the tree
            if (conflicts[newClass.class_title] && conflicts[newClass.class_title].includes(subclass.type)) {
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
    };

    this._dfs = function(classData, currentSchedule, intervalTree, schedules, conflicts, counter) {
        if (currentSchedule.length >= classData.length) {
            let score = this.evaluateSchedule(currentSchedule);
            schedules.push([score, currentSchedule]);

            // doing stuff for progress bar for schedules
            this.numSchedules++;
            let schedulePercentComplete = Math.round(100 * (this.numSchedules / this.totalPossibleSchedules));
            this.dispatchProgressFunction(schedulePercentComplete);

            return currentSchedule;
        }

        let currentClassGroup = classData[counter];
        for (let i = 0; i < currentClassGroup.length; i++) {
            let currentClass = currentClassGroup[i];
            if (this.isValid(currentClass, conflicts, intervalTree)) {
                currentSchedule.push(currentClass);
                this._dfs(classData, currentSchedule, intervalTree, schedules, conflicts, counter + 1);
                for (let j = counter; j < currentSchedule.length; j++) {
                    currentSchedule[j].timeIntervals.forEach(timeInterval => intervalTree.remove(timeInterval));
                }
                currentSchedule = currentSchedule.slice(0, counter);
            }
        }
    };

    this.dfs = function(classData, conflicts) {
        let schedules = [];
        // set num schedules to this, note that it will not be set with the ones after
        // due to javascript pass by value
        this._dfs(classData, [], new SimpleIntervalTree(), schedules, conflicts, 0);

        schedules = schedules.sort((scheduleArr1, scheduleArr2) => {
            if (scheduleArr1[0] > scheduleArr2[0]) return -1; else return 1;
        });

        // say we are complete
        this.dispatchProgressFunction(100);

        if (schedules.length > 0) {
            return schedules[0][1];
        } else {
            return null;
        }
    };

    this.generateSchedule = async function(selectedClasses, conflicts = [], preferences = [], dispatchProgressFunction) {
        this.dispatchProgressFunction = dispatchProgressFunction;
        this.numSchedules = 0;
        this.totalPossibleSchedules = 1;
        selectedClasses = Object.values(selectedClasses);
        // making the JSON here for the request
        let selectedClassesJSON = {};
        selectedClassesJSON['classes'] = selectedClasses;


        // class data is an object where each field is the name of a class and everything inside it
        // is a class with its times and such
        let dirtyClassJSON = await requestDirtyData(selectedClassesJSON);
        // class will put the data into
        // CSE 11 -> section 0, section 1
        let classData = cleanData(dirtyClassJSON);
        // counter of where we are in the dfs
        let counter = 0;

        // further filtering into just sections
        let classSections = [];

        Object.keys(classData).forEach(courseNum => {
            // class group is an array of all the different sections that are the same class
            let classSectionsForCourseNum = classData[courseNum];
            // multiplying to see total number of schedules
            this.totalPossibleSchedules *= classSectionsForCourseNum.length;

            // adding to total count
            classSectionsForCourseNum.map(classSectionForCourseNum => classSections.push(classSectionForCourseNum));
        });
        // now we have an array where each index is a Class Group
        // we can start brute force dfs now

        this.evaluateSchedule = (schedule) => {
            return preferences.reduce((accumulator, evaluator) => {
                return accumulator +
                    schedule.reduce((classAccum, Class) => {
                        return classAccum + evaluator.evaluate(Class)
                    }, 0);
            }, 0);
        };

        return this.dfs(classSections, conflicts);
    }
}

