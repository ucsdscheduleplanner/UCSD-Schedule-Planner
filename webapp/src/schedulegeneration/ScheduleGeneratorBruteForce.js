import {SimpleIntervalTree} from "../utils/SimpleIntervalTree";
import {Subsection} from "../utils/ClassUtils";


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

                // we can have issues where all classes are canceled
                if (subsectionsPerSection.length > 0) {
                    ret[courseName].push(subsectionsPerSection);
                }
                slowPtr = fastPtr;
            }

            fastPtr++;
        }
    }
    // no alterations to input
    return ret;
}

/**
 *
 * @param section
 * @param conflicts is a dictionary with that maps class titles to the sections to ignore
 */
function ignoreSubsections(section, conflicts) {
    if (!section || section.length === 0) {
        return section;
    }
    let firstSubsection = section[0];
    if (!(firstSubsection.classTitle in conflicts)) {
        return section;
    }

    let conflictsForClassTitle = conflicts[firstSubsection.classTitle];
    return section.filter(s => !conflictsForClassTitle.includes(s.type));
}

/**
 * Will hold the actual schedule and any errors that come up
 * @param schedule
 * @param errors
 * @constructor
 */
function Schedule(schedule, errors) {
    this.classes = schedule;
    this.errors = errors;
}

export function ScheduleGenerationBruteForce() {
    this.failedAdditions = {};

    // subsection has a time interval object, represents a subsection with data
    this.isValid = function (subsection, intervalTree) {
        let timeInterval = subsection.timeInterval;

        if (!intervalTree.add(timeInterval)) {
            return false;
        }

        // removing intervals we have added to make sure no side effects
        intervalTree.remove(timeInterval);
        return true;
    };

    this.canAddSection = function (section, intervalTree) {
        for (let subsection of section) {
            // isValid is a pure function, so does not affect the intervalTree
            if (!this.isValid(subsection, intervalTree)) {
                return false;
            }
        }
        return true;
    };

    this.addSection = function(section, intervalTree) {
        for(let subsection of section) {
            intervalTree.add(subsection.timeInterval);
        }
    };

    this.removeSection = function(section, intervalTree) {
        for(let subsection of section) {
            intervalTree.remove(subsection.timeInterval);
        }
    };

    this.handleFailedToAdd = function(section) {
        if(section.length <= 0)
            return;

        if(!this.failedAdditions.hasOwnProperty(section[0].classTitle))
            this.failedAdditions[section[0].classTitle] = 0;
        this.failedAdditions[section[0].classTitle]++;
    };

    this._dfs = function (classData, currentSchedule, intervalTree, schedules, conflicts, counter) {
        if (currentSchedule.length >= classData.length) {
            let score = this.evaluateSchedule(currentSchedule);
            schedules.push([score, currentSchedule]);

            // doing stuff for progress bar for schedules
            this.numSchedules++;
            //console.info(this.numSchedules);
            let schedulePercentComplete = Math.round(100 * (this.numSchedules / this.totalPossibleSchedules));
            this.dispatchProgressFunction(schedulePercentComplete);

            return currentSchedule;
        }

        let currentClassGroup = classData[counter];
        for (let i = 0; i < currentClassGroup.length; i++) {
            // current class group has all the sections for CSE 11
            // this will be an array of sections
            // so [[class, class] , [class, class]]

            // current section
            let currentSection = currentClassGroup[i];
            let filteredSection = ignoreSubsections(currentSection, conflicts);

            if(!this.canAddSection(filteredSection, intervalTree)) {
                this.handleFailedToAdd(filteredSection);
                continue;
            }

            // adding subsections to interval tree if they are all valid
            this.addSection(filteredSection, intervalTree);

            // choosing to use this for our current schedule - use the actual section not what was filtered
            // this is so that the result has all the correct subsections, but we operate with the filtered sections
            currentSchedule.push(currentSection);
            this._dfs(classData, currentSchedule, intervalTree, schedules, conflicts, counter + 1);

            // removing all intervals we added so can continue to DFS
            this.removeSection(filteredSection, intervalTree);

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

        let classes = [];
        if (schedules.length > 0) {
            classes = schedules[0][1];
        }
        return new Schedule(classes, this.failedAdditions);
    };

    this.generateSchedule = async function (classData, conflicts = [], preferences = [], dispatchProgressFunction) {
        this.dispatchProgressFunction = dispatchProgressFunction;
        this.numSchedules = 0;
        this.totalPossibleSchedules = 1;

        // will put the data into
        // CSE 11 -> section 0 [subsection, subsection], section 1 [subsection, subsection]
        classData = cleanData(classData);

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


        this.evaluateSchedule = (schedule) => {
            let score = 0;
            for (let Class of schedule) {
                if (Class.length === 0) {
                    return 0;
                }

                for (let preference of preferences) {
                    score += preference.evaluate(Class);
                }
            }
            return score;
        };

        // now we have an array where each index is a Class Group
        // we can start brute force dfs now
        return this.dfs(inputToDFS, conflicts);
    };
}

