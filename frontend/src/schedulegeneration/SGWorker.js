// the code that goes into the web worker
export function SGWorker() {
    const INCREMENT_PROGRESS = "INCREMENT_PROGRESS";
    const FINISH_GENERATING = "FINISH_GENERATING";

    this.onmessage = function (evt) {
        console.log("Beginning to generate schedule inside worker");
        if (!evt)
            return;

        let data = evt.data;
        console.log("Data is: ");
        console.log(data);

        let {classData, classTypesToIgnore, preferences} = data;
        // have to convert from JSON preferences to preference objects
        let {specificPref, globalPref} = initPreferences(preferences);
        console.log(specificPref, globalPref);

        let worker = new ScheduleGenerator(classData, classTypesToIgnore, specificPref, globalPref);
        let results = worker.generate();

        // returns a promise
        postMessage({
            type: FINISH_GENERATING,
            generationResult: results
        });
    };

    /**
     * Testing seam
     * @param data
     * @returns {ScheduleGenerator}
     */
    this.getScheduleGenerator = function (data) {
        let {classData, conflicts, specificPref, globalPref} = data;
        return new ScheduleGenerator(classData, conflicts, specificPref, globalPref);
    };

    /**
     * Testing seam
     * @returns {GlobalPref}
     */
    this.getGlobalPref = function (globalPref) {
        return new GlobalPref(globalPref);
    };

    /**
     * Testing seam
     * @returns {SpecificPref}
     */
    this.getSpecificPref = function (specificPref) {
        return new SpecificPref(specificPref);
    };

    /**
     * Testing seam
     * @param data input data
     * @returns {GenerationResult}
     */
    this.generate = function (data) {
        let {classData, classTypesToIgnore, preferences} = data;

        // have to convert from JSOn preferences to preference objects

        let {specificPref, globalPref} = initPreferences(preferences);
        let worker = new ScheduleGenerator(classData, classTypesToIgnore, specificPref, globalPref);

        return worker.generate();
    };

    function initPreferences(preferences) {
        let {globalPref, classSpecificPref} = preferences;
        console.log(preferences);
        let gPref = new GlobalPref(globalPref);
        let sPref = new SpecificPref(classSpecificPref);

        console.log(sPref);

        return {globalPref: gPref, specificPref: sPref};
    }

    function SpecificPref(specificPref) {
        this.specificPref = specificPref;

        SpecificPref.prototype.evaluateInstructor = function (subsection, classTitle) {
            if (!this.specificPref) {
                return 0;
            }

            // TODO consider altering the data in the database such that sectionNum is an underscore delimited quantity e.g CSE_11$0 so can easily
            // TODO replace the underscore with a space and use it here

            if(!subsection.instructor) {
                console.warn("Instructor for subsection is null or undefined");
                return -99;
            }

            console.log("SPECIFIC PREF");
            console.log(this.specificPref);

            let instructorPref = this.specificPref[classTitle].instructorPref;
            if (!instructorPref)
                return 0;

            if (instructorPref === subsection.instructor)
                return 5;

            return 0;
        };

        SpecificPref.prototype.evaluate = function (section) {
            // testing for null or undefined section, specificPref or empty specificPref object
            if (!section || !this.specificPref || Object.keys(this.specificPref).length === 0)
                return 0;

            if (section.subsections.length === 0) {
                console.warn(`Section  + ${section.sectionNum} somehow has no subsections, not evaluating.`);
                return 0;
            }

            let score = 0;
            for (let subsection of section.subsections) {
                score += this.evaluateInstructor(subsection, section.classTitle);
            }
            console.log("SPECIFIC SCORE IS " + score);
            return score;
        }
    }

    function GlobalPref(globalPref) {
        this.globalPref = globalPref;

        GlobalPref.prototype.evaluateTime = function (subsection) {
            console.log("EVALUATING TIME");
            let startPref = this.globalPref.startPref;
            let endPref = this.globalPref.endPref;

            console.log(this.globalPref);

            // TODO handle null cases
            if (!startPref || !endPref)
                return 0;

            startPref.setHours(startPref.getHours(), startPref.getMinutes(), 0);
            endPref.setHours(endPref.getHours(), endPref.getMinutes(), 0);

            let score = 0;
            // this shouldn't happen but if it does punish hardcore
            if (!subsection.timeInterval) {
                return -99;
            }

            let tempStart = subsection.timeInterval["start"];
            let tempEnd = subsection.timeInterval["end"];

            // copying the startPref and just setting the hours on it
            let rangeStart = new Date(startPref.getTime());
            rangeStart.setHours(tempStart.getHours(), tempStart.getMinutes(), 0);

            let rangeEnd = new Date(endPref.getTime());
            rangeEnd.setHours(tempEnd.getHours(), tempEnd.getMinutes(), 0);

            console.log(rangeStart);
            console.log(rangeEnd);

            console.log("CHECKING RANGES");
            // they overlap!
            if (rangeStart < endPref && rangeEnd > startPref) {
                score += 1;
                // the range is inside our desired range!
                if (rangeStart >= startPref && rangeEnd <= endPref) {
                    score += 3;
                }
            }

            if (!subsection.day) {
                return -10;
            }

            return score;
        };

        GlobalPref.prototype.evaluateDay = function (subsection) {
            let dayPref = this.globalPref.dayPref;
            if (!dayPref)
                return 0;

            if (dayPref.includes(subsection.day)) {
                return 5;
            }

            return 0;
        };

        GlobalPref.prototype.evaluate = function (section) {
            if (!this.globalPref || !section)
                return 0;

            if (section.subsections.length === 0)
                return 0;

            let score = 0;

            for (let subsection of section.subsections) {
                score += this.evaluateDay(subsection);
                score += this.evaluateTime(subsection);
            }

            return score;
        }
    }

    function SimpleIntervalTreeNode(interval, sectionNum) {
        this.interval = interval;
        this.sectionNum = sectionNum;
        this.left = null;
        this.right = null;

        SimpleIntervalTreeNode.prototype.after = function (otherInterval) {
            return (this.interval['start'] > otherInterval['end']);
        };

        SimpleIntervalTreeNode.prototype.before = function (otherInterval) {
            return (this.interval['end'] < otherInterval['start']);
        };
    }

    function SimpleIntervalTree() {
        this.size = 0;
        this.root = null;

        SimpleIntervalTree.prototype.add = function (interval, sectionNum) {
            // converting into a node
            let prevSize = this.size;
            this.root = this.insert(this.root, interval, sectionNum);
            let afterSize = this.size;
            return afterSize === prevSize + 1;
        };

        SimpleIntervalTree.prototype.insert = function (node, interval, sectionNum) {
            if (node === null) {
                this.size++;
                return new SimpleIntervalTreeNode(interval, sectionNum);
            }
            if (node.before(interval)) {
                node.right = this.insert(node.right, interval, sectionNum);
            } else if (node.after(interval)) {
                node.left = this.insert(node.left, interval, sectionNum);
            }
            return node;
        };

        SimpleIntervalTree.prototype.contains = function (interval) {
            return this.nodeContains(this.root, interval);
        };

        SimpleIntervalTree.prototype.nodeContains = function (node, interval) {
            if (node === null) {
                return null;
            }
            if (node.before(interval)) {
                return this.nodeContains(node.right, interval);
            } else if (node.after(interval)) {
                return this.nodeContains(node.left, interval);
            }
            return node.sectionNum;
        };

        SimpleIntervalTree.prototype.remove = function (interval, sectionNum) {
            this.root = this.removeNode(this.root, interval, sectionNum);
        };

        SimpleIntervalTree.prototype.removeNode = function (node, interval, sectionNum) {
            if (node === null) return null;
            if (node.interval === interval && node.sectionNum === sectionNum) {
                // decrement size
                this.size--;
                // case 1 no children YAY
                if (node.right === null && node.left === null) {
                    return null;
                }
                // case 2 we have one children on one side
                if (node.right === null && node.left !== null) {
                    return node.left;
                }
                if (node.left === null && node.right !== null) {
                    return node.right;
                }

                // case 3 bad case where we have to find the smallest guy on right tree
                if (node.left !== null && node.right !== null) {
                    // have two pointers so we know what is above it
                    let lagPointer = node;
                    let fastPointer = node.right;
                    while (fastPointer.left !== null) {
                        lagPointer = fastPointer;
                        fastPointer = fastPointer.left;
                    }
                    // now we have the leftmost thing on the right subtree
                    // so we delete it
                    // should return the right node or null

                    // this is the case where lag pointer's immediate child is a leaf
                    // that means we want to sub root out with lag pointer
                    // must remove the lag pointer then

                    // if lag pointer is the node then fast pointer must be immediately to its right
                    if (lagPointer === node) {
                        lagPointer.right = this.removeNode(fastPointer, fastPointer.interval, sectionNum);
                    } else {
                        // otherwise it is to the left and we can remove from the left
                        lagPointer.left = this.removeNode(fastPointer, fastPointer.interval, sectionNum);
                    }
                    // gotta add back the thing we removed cause we didn't actually end up removing in this stack frame
                    this.size++;
                    fastPointer.left = node.left;
                    fastPointer.right = node.right;
                    // return the fast pointer to indicate that we have shifted it up
                    return fastPointer;
                }
            } else {
                if (node.before(interval)) {
                    node.right = this.removeNode(node.right, interval, sectionNum);
                } else if (node.after(interval)) {
                    node.left = this.removeNode(node.left, interval, sectionNum);
                }
                return node;
            }
        }
    }

    /**
     * Stores the generated schedules and any errors that occurred
     */
    function GenerationResult(schedules, errors) {
        this.schedules = schedules;
        this.errors = errors;
    }

    /**
     *
     * @param classData
     * @param classTypesToIgnore a mapping from class title to types to ignore
     * @param specificPref
     * @param globalPref
     * @constructor
     */
    function ScheduleGenerator(classData = [], classTypesToIgnore = {}, specificPref = {}, globalPref = {}) {
        // error map represents an undirected graph where (u,v) exists in edge set E iff u is incompatible with v
        // key is u, value is list of v in which above relationship holds
        this.errorMap = {};

        // holds the number of completed schedules that were generated
        // includes the ones that failed to generate
        this.batchedUpdates = 0;

        this.classData = classData;
        this.classTypesToIgnore = classTypesToIgnore;
        this.specificPref = specificPref;
        this.globalPref = globalPref;

        // an interval tree for generating schedules
        this.intervalTree = new SimpleIntervalTree();

        /**
         * Will ignore the subsections in a given section
         * @param Class the current Class which holds the sections
         * @param section the current section we are iterating on
         */
        ScheduleGenerator.prototype.getNonIgnoredSubsections = function (Class, section) {
            let conflictsForClassTitle = this.classTypesToIgnore[Class.title];
            return section.subsections.filter(s => !conflictsForClassTitle.includes(s.type));
        };

        /**
         * Adds all the subsections of the given section to the interval tree
         * @param section - section we want to add
         */
        ScheduleGenerator.prototype.addSection = function (section) {
            for (let subsection of section.subsections) {
                // include the class title for error management purposes
                this.intervalTree.add(subsection.timeInterval, section.sectionNum);
            }
        };

        /**
         * Checks the interval tree for intervals that are the same and stores them in a list
         * @param section - section to check
         * @returns {Array} a list of section classTitles that conflict
         */
        ScheduleGenerator.prototype.getConflictingSections = function (section) {
            let ret = new Set();
            for (let subsection of section.subsections) {
                let conflictingSection = this.intervalTree.contains(subsection.timeInterval);
                if (conflictingSection !== null) {
                    ret.add(conflictingSection);
                    console.log(section);
                    console.log("Found conflict on trying to add " + section.sectionNum);
                }
            }
            return Array.from(ret);
        };

        /**
         * Remove section from the interval tree
         * @param section - section we want to remove
         */
        ScheduleGenerator.prototype.removeSection = function (section) {
            for (let subsection of section.subsections) {
                // only remove the subsections that have the same class title
                this.intervalTree.remove(subsection.timeInterval, section.sectionNum);
            }
        };

        /**
         * Increment the update count and update the progress bar if we are past a certain
         * threshold
         * @param val the amount we want to increment by =
         */
        ScheduleGenerator.prototype.incrementProgress = function (val) {
            console.log("Batching updates for progress bar, currently batched: " + this.batchedUpdates);
            // doing stuff for progress bar for schedules
            this.batchedUpdates += val;
            if (this.batchedUpdates > 10) {
                postMessage({type: INCREMENT_PROGRESS, amount: this.batchedUpdates});
                this.batchedUpdates = 0;
            }
        };

        /**
         * Gets the section object for the class given the sectionNum identification field
         * @param sectionNum the field that identifies which section, CSE11$0,
         */
        ScheduleGenerator.prototype.getSectionFor = function (sectionNum) {
            // this is really inefficient but cannot come up with a bette way to do it right now
            // splitting the string based on info
            for (let Class of this.classData) {
                if (sectionNum.startsWith(Class.department)) {
                    for (let section of Class.sections) {
                        if (section.sectionNum === sectionNum)
                            return section;
                    }
                }
            }
        };

        // I wrote this cause I had to don't judge me future person (probably Cameron)
        /**
         * Builds a class object after done with generation, copying over all the data from the previous class
         * object but overwriting the sections field to replace it with only one section
         * @param sectionNum the section number of the class I want to replace
         * @returns {any}
         */
        ScheduleGenerator.prototype.buildClass = function (sectionNum) {
            for (let Class of this.classData) {
                // CSE 11$0 is the sectionNum
                // CSE is the department
                if (sectionNum.startsWith(Class.department)) {
                    for (let curSection of Class.sections) {
                        if (sectionNum === curSection.sectionNum) {
                            // don't want to copy the previous sections field, only want the new one
                            return Object.assign({}, Class, {sections: [curSection]});
                        }
                    }
                }
            }
        };

        /**
         * Will evaluate the given schedule with the preference objects given
         * @param schedule the schedule to evaluate
         * @returns {number} the score of the given schedule
         */
        ScheduleGenerator.prototype.evaluateSchedule = function (schedule) {
            let score = 0;
            // sectionNum is like CSE11$0 and CSE12$1
            for (let sectionNum of schedule) {
                let section = this.getSectionFor(sectionNum);
                if(this.specificPref)
                    score += this.specificPref.evaluate(section);
                if(this.globalPref)
                    score += this.globalPref.evaluate(section);
            }
            console.log("Score after evaluation for schedule " + schedule + " is: " + score);
            return score;
        }
    }

    /**
     * On the case in which we failed to add a class, get all the sections that conflicted upon addition
     * and update the undirected graph (represented as a dictionary) with the class titles
     * @param sectionFailedToAdd - self explanatory
     * @param sectionConflicts - list of class titles that conflicted
     */
    ScheduleGenerator.prototype.handleFailedToAdd = function (sectionFailedToAdd, sectionConflicts) {
        if (sectionFailedToAdd.subsections.length === 0)
            return;

        // make sure there are conflicts just in case
        if (sectionConflicts.length < 1)
            return;

        let sectionNum = sectionFailedToAdd.sectionNum;
        // no source vertex as
        if (!(sectionNum in this.errorMap))
            this.errorMap[sectionNum] = new Set();

        sectionConflicts.forEach(conflict => {
            // mapping one part of source
            this.errorMap[sectionNum].add(conflict);

            // have to add failedClassTitle to other sources too
            if (!(conflict in this.errorMap))
                this.errorMap[conflict] = new Set();

            this.errorMap[conflict].add(sectionNum);
        });
    };

    ScheduleGenerator.prototype.isClassIgnored = function (Class) {
        return Class.title in this.classTypesToIgnore;
    };

    ScheduleGenerator.prototype.updateProgressForFailedAdd = function (curClassIndex) {
        let failedSchedules = 1;
        // getting all classes that could have been part of this generationResult
        for (let i = curClassIndex + 1; i < this.classData.length; i++) {
            failedSchedules *= this.classData[i].sections.length;
        }
        // incrementing for them because we know they failed
        this.incrementProgress(failedSchedules);
    };

    ScheduleGenerator.prototype.dfs = function (result, currentSchedule = [], numClassesAdded = 0) {
        console.log("Current schedule is " + currentSchedule);
        if (numClassesAdded >= this.classData.length) {
            if (currentSchedule.length === 0) {
                console.log("Schedule is empty, skipping");
                return;
            }

            console.log("Adding schedule " + currentSchedule);
            let score = this.evaluateSchedule(currentSchedule);
            const copySchedule = currentSchedule.slice();
            result.push([score, copySchedule]);


            this.incrementProgress(1);
            return;
        }

        let currentClass = this.classData[numClassesAdded];

        // this occurs when all the sections are TBA or cancelled
        // no sections for this class
        if (currentClass.sections.length === 0) {
            // just increment the counter one
            this.dfs(result, currentSchedule, numClassesAdded + 1);
        }

        for (let i = 0; i < currentClass.sections.length; i++) {
            // current class group has all the sections for CSE 11
            // this will be an array of sections
            // so [[class, class] , [class, class]]

            // current section
            let currentSection = currentClass.sections[i];

            // no need to look at this section if it has no subsections
            if (currentSection.subsections.length === 0)
                continue;

            // check first if we should even care to remove subsections
            if (this.isClassIgnored(currentClass)) {
                // reassigning for immutability - can be removed if needed
                currentSection = Object.assign({}, currentSection);
                // TODO change method name this is disgusting
                currentSection.subsections = this.getNonIgnoredSubsections(currentClass, currentSection);
            }

            // check if we have any time conflicts on adding all the subsections
            // (NOTE) goes off the assumption that there are no conflicts within the class - that
            // was proven to be incorrect
            let conflictsForSection = this.getConflictingSections(currentSection);
            console.log("Conflicting sections " + conflictsForSection);
            // if we have any conflicts at all that mean the section cannot be added
            if (conflictsForSection.length > 0) {
                this.handleFailedToAdd(currentSection, conflictsForSection);
                this.updateProgressForFailedAdd(numClassesAdded);
                continue;
            }

            // adding subsections to interval tree if they are all valid
            this.addSection(currentSection);

            currentSchedule.push(currentSection.sectionNum);
            // choosing to use this for our current generationResult - use the actual section not what was filtered
            // this is so that the result has all the correct subsections, but we operate with the filtered sections
            this.dfs(result, currentSchedule, numClassesAdded + 1);

            // remove after done
            currentSchedule.pop();
            // removing all intervals we added so can continue to DFS
            this.removeSection(currentSection);
        }
    };

    ScheduleGenerator.prototype.getTopK = function (schedules, k) {
        // schedules is now populated with data
        schedules = schedules.sort((scheduleArr1, scheduleArr2) => {
            if (scheduleArr1[0] > scheduleArr2[0]) return -1; else return 1;
        });

        // get the top 5
        schedules = schedules.slice(0, k + 1);
        // schedules is an array of tuples where arr[0] is the score and arr[1] is the list of sections
        return schedules.map(arr => {
            return arr[1].map(sectionNum => this.buildClass(sectionNum));
        });
    };

    ScheduleGenerator.prototype.generate = function () {
        let schedules = [];
        console.log(this.classData);

        try {
            this.dfs(schedules);
            schedules = this.getTopK(schedules, 5);
        } catch (error) {
            console.error(error);
        }

        // only care about a specific amount
        // convert all of the sets in the error map to lists
        Object.keys(this.errorMap).forEach(errorKey => this.errorMap[errorKey] = Array.from(this.errorMap[errorKey]));

        let errors = this.errorMap;
        if (schedules.length > 0)
            errors = {};

        // only really care about errors if we failed to generate a generationResult
        let ret = new GenerationResult(schedules, errors);
        console.log(schedules);
        console.log(ret);
        return ret;
    }
}



