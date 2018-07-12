import {BACKEND_URL} from "../settings";
import {SimpleIntervalTree} from "../utils/SimpleIntervalTree";
import {Subsection} from "../utils/ClassUtils";
import localforage from "localforage";

/**
 * Function requests data from the backend given a list of classes that the user has picked. Implements caching as well
 * using local storage to reduce fetch size and hopefully speed up application.
 *
 * @param selectedClasses A list of pseudo class objects, not subsection objects, but bare Class objects.
 * @returns An object where each key is an element of the array of classes passed in and the value is an array
 * of subsections belonging to that class
 */
async function requestDirtyData(selectedClasses) {
    let classesToFetch = [];
    let cachedClasses = [];

    for (let Class of selectedClasses) {
        let cacheObj = await localforage.getItem(Class.classTitle);
        if (cacheObj) {
            cachedClasses.push(Class.classTitle);
        } else {
            classesToFetch.push(Class);
        }
    }

    let ret = {};

    // precompute caching
    for (let cachedClassKey of cachedClasses) {
        console.info(`Caching layer has been hit for ${cachedClassKey}`);
        ret[cachedClassKey] = JSON.parse(await localforage.getItem(cachedClassKey));
    }
    // only want to make the fetch if we don't have classes cached
    if (classesToFetch.length !== 0) {
        let fetchBody = JSON.stringify({"classes": classesToFetch});
        let response = await fetch(`${BACKEND_URL}/api_data`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: fetchBody
        });
        // response JSON is an object where each key is a class from selectedClasses (if cache was not hit)
        // and the value is an array of subsections for that Class
        let responseJSON  = await response.json();
        for (let classTitle of Object.keys(responseJSON)) {
            // appending to ret
            ret[classTitle] = responseJSON[classTitle];
            // have to stringify so can parse it because local storage only takes in key value pairs
            localforage.setItem(classTitle, JSON.stringify(responseJSON[classTitle]));
        }
    }

    return ret;
}

function isValidSubsection(subsection) {
    // we don't want to include finals or midterms in the regular week view
    if (subsection.type === "FI" || subsection.type === "MI") {
        return false;
    }
    // if timeInterval is null that means time is TBA and/or day is TBA which means
    // don't include in here
    if (!subsection.timeInterval) {
        return false;
    }
    return true;
}

// dirty class data is a 2D array where each element is an array of subsections for each class section
function cleanData(dirtyClassData) {
    let ret = {};
    for (let courseName of Object.keys(dirtyClassData)) {
        ret[courseName] = [];

        let slowPtr = 0;
        let fastPtr = 0;

        let copyCourseData = dirtyClassData[courseName].slice();
        copyCourseData.push({"SECTION_ID": null});

        while (fastPtr < copyCourseData.length) {
            let slowSectionID = copyCourseData[slowPtr]["SECTION_ID"];
            let fastSectionID = copyCourseData[fastPtr]["SECTION_ID"];

            if (slowSectionID !== fastSectionID) {
                // inclusive exclusive for bounds
                let subsectionsPerSection = copyCourseData.slice(slowPtr, fastPtr);
                // converting each one into a subsection
                subsectionsPerSection = subsectionsPerSection.reduce((ret, subsectionData) => {
                    let subsection = new Subsection(subsectionData);
                    if (isValidSubsection(subsection)) {
                        ret.push(subsection);
                    }
                    return ret;

                }, []);
                ret[courseName].push(subsectionsPerSection);
                slowPtr = fastPtr;
            }

            fastPtr++;
        }
    }
    // no alterations to input
    return ret;
}

export function ScheduleGenerationBruteForce() {
    // subsection has a time interval object, represents a subsection with data
    this.isValid = function (subsection, conflicts, intervalTree) {
        let timeInterval = subsection.timeInterval;
        // if we have a conflict, that means we don't care so don't add to the tree
        if (conflicts[subsection.classTitle] && conflicts[subsection.classTitle].includes(subsection.type)) {
            return true;
        }

        if (!intervalTree.add(timeInterval)) {
            return false;
        }

        // removing intervals we have added
        // making sure no side effects if unsuccessful
        intervalTree.remove(timeInterval);
        return true;
    };

    this._dfs = function (classData, currentSchedule, intervalTree, schedules, conflicts, counter) {
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
            // current class group has all the sections for CSE 11
            // this will be an array of sections
            // so [[class, class] , [class, class]]

            let success = true;
            // current section
            let currentSection = currentClassGroup[i];
            for (let subsection of currentSection) {
                // isValid is a pure function, so does not affect the intervalTree
                if (!this.isValid(subsection, conflicts, intervalTree)) {
                    success = false;
                    break;
                }
            }
            if (!success) {
                continue;
            }
            // adding subsections to interval tree if they are all valid
            for (let subsection of currentSection) {
                intervalTree.add(subsection.timeInterval);
            }

            // choosing to use this for our current schedule
            currentSchedule.push(currentSection);
            this._dfs(classData, currentSchedule, intervalTree, schedules, conflicts, counter + 1);

            // removing all intervals we added so can continue to DFS
            for (let subsection of currentSection) {
                intervalTree.remove(subsection.timeInterval);
            }
            // putting schedule in state before we added the current section
            currentSchedule = currentSchedule.slice(0, counter);
        }
    };

    this.dfs = function (classData, conflicts) {
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

    this.generateSchedule = async function (selectedClasses, conflicts = [], preferences = [], dispatchProgressFunction) {
        this.dispatchProgressFunction = dispatchProgressFunction;
        this.numSchedules = 0;
        this.totalPossibleSchedules = 1;
        selectedClasses = Object.values(selectedClasses);

        let dirtyClassJSON = await requestDirtyData(selectedClasses);
        // will put the data into
        // CSE 11 -> section 0 [subsection, subsection], section 1 [subsection, subsection]
        let classData = cleanData(dirtyClassJSON);

        // input is a 2D array where each element is a list of all the sections of a specific class
        // converting dict where key is courseNum to 2D array
        let inputToDFS = [];

        Object.keys(classData).forEach(courseNum => {
            // class sections for course num is an array of all the different sections that are the same class
            // CSE 11: [[class, class], [class, class]]
            let classSectionsForCourseNum = classData[courseNum];
            // multiplying to see total number of schedules because length of classSectionsForCourseNum gives num sections
            this.totalPossibleSchedules *= classSectionsForCourseNum.length;

            inputToDFS.push(classSectionsForCourseNum);
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

        return this.dfs(inputToDFS, conflicts);
    };
}

