export function SGWorkerCode() {
    function PriorityModifier(Class = null, preferences, priority) {
        this.Class = Class;
        this.classTitle = Class.classTitle;
        // list of different preference objects
        this.preferences = preferences;
        this.priority = priority;

        this.evaluate = function (classToEvaluate) {
            let score = 0;
            for (let preference of this.preferences) {
                score = this.priority * (score + preference.evaluate(classToEvaluate));
            }
            return score;
        }
    }

    function InstructorPreference(Class, instructor) {
        this.Class = Class;
        this.classTitle = Class.classTitle;
        this.instructor = instructor;

        // should get this because arrow function takes closest scope
        this.evaluate = function (classToEvaluate) {
            if (classToEvaluate.length === 0) {
                return 0;
            }

            // can just get the first one because we are only looking at instructors
            // and they all have the same instructor
            let subsection = classToEvaluate[0];
            if (subsection.classTitle === Class.classTitle) {
                if (subsection.instructor === Class.instructor) {
                    return 10;
                }
                return -3;
            }
            // not the same class so do not care
            return 0;
        }
    }

    /**
     * Because this is a general generationResult preference we don't need any specific classes
     * @constructor
     * @param start
     * @param end
     */
    function TimePreference(start, end) {
        this.start = new Date();
        this.start.setHours(start.getHours(), start.getMinutes(), 0);

        this.end = new Date();
        this.end.setHours(end.getHours(), end.getMinutes(), 0);

        this.evaluate = function (classToEvaluate) {
            if (classToEvaluate.length === 0) {
                return 0;
            }

            let score = 0;
            for (let subsection of classToEvaluate) {
                // this shouldn't happen but if it does punish hardcore
                if (!subsection.timeInterval) {
                    score -= 999;
                    break;
                }

                let tempStart = subsection.timeInterval["start"];
                let tempEnd = subsection.timeInterval["end"];

                let rangeStart = new Date();
                rangeStart.setHours(tempStart.getHours(), tempStart.getMinutes(), 0);

                let rangeEnd = new Date();
                rangeEnd.setHours(tempEnd.getHours(), tempEnd.getMinutes(), 0);

                // they overlap!
                if (rangeStart < this.end && rangeEnd > this.start) {
                    score += 10;
                    // the range is inside our desired range!
                    if (rangeStart >= this.start && rangeEnd <= this.end) {
                        score += 20;
                    }
                }
            }
            return score;
        }
    }

    function DayPreference(days) {
        this.days = days;

        this.evaluate = function (classToEvaluate) {
            if (classToEvaluate.length === 0) {
                return 0;
            }
            let score = 0;
            for (let subsection of classToEvaluate) {
                if (!subsection.day) {
                    score += -10;
                }
                if (this.days.includes(subsection.day)) {
                    score += 20;
                }
                score += -5;
            }
            return score;
        }
    }


    function SimpleIntervalTreeNode(interval, classTitle) {
        this.interval = interval;
        this.classTitle = classTitle;
        this.left = null;
        this.right = null;

        this.after = function (otherInterval) {
            return (this.interval['start'] > otherInterval['end']);
        };

        this.before = function (otherInterval) {
            return (this.interval['end'] < otherInterval['start']);
        }
    }

    function SimpleIntervalTree() {
        this.size = 0;
        this.root = null;

        this.add = function (interval, classTitle) {
            // converting into a node
            let prevSize = this.size;
            this.root = this.insert(this.root, interval, classTitle);
            let afterSize = this.size;
            return afterSize === prevSize + 1;
        };

        this.insert = function (node, interval, classTitle) {
            if (node === null) {
                this.size++;
                return new SimpleIntervalTreeNode(interval, classTitle);
            }
            if (node.before(interval)) {
                node.right = this.insert(node.right, interval, classTitle);
            } else if (node.after(interval)) {
                node.left = this.insert(node.left, interval, classTitle);
            }
            return node;
        };

        this.contains = function (interval) {
            return this.nodeContains(this.root, interval);
        };

        this.nodeContains = function (node, interval) {
            if (node === null) {
                return null;
            }
            if (node.before(interval)) {
                return this.nodeContains(node.right, interval);
            } else if (node.after(interval)) {
                return this.nodeContains(node.left, interval);
            }
            return node.classTitle;
        };

        this.remove = function (interval, classTitle) {
            this.root = this.removeNode(this.root, interval, classTitle);
        };

        this.removeNode = function (node, interval, classTitle) {
            if (node === null) return null;
            if (node.interval === interval && node.classTitle === classTitle) {
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
                        lagPointer.right = this.removeNode(fastPointer, fastPointer.interval, classTitle);
                    } else {
                        // otherwise it is to the left and we can remove from the left
                        lagPointer.left = this.removeNode(fastPointer, fastPointer.interval, classTitle);
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
                    node.right = this.removeNode(node.right, interval, classTitle);
                } else if (node.after(interval)) {
                    node.left = this.removeNode(node.left, interval, classTitle);
                }
                return node;
            }
        }
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
     * Will hold the actual generationResult and any errors that come up
     * @param schedule
     * @param errors
     * @constructor
     */
    function Schedule(schedule) {
        this.classes = schedule;
    }

    function GenerationResult(schedules, errors) {
        this.schedules = schedules;
        this.errors = errors;
    }

    function SGWorker() {
        // error map represents an undirected graph where (u,v) exists in edge set E iff u is incompatible with v
        // key is u, value is list of v in which above relationship holds
        this.errorMap = {};

        // holds the number of completed schedules that were generated
        // includes the ones that failed to generate
        this.batchedUpdates = 0;

        /**
         * Adds all the subsections of the given section to the interval tree
         * @param section - section we want to add
         * @param intervalTree - interval tree we are adding to
         */
        this.addSection = function (section, intervalTree) {
            for (let subsection of section) {
                // include the class title for error management purposes
                intervalTree.add(subsection.timeInterval, subsection.classTitle);
            }
        };

        /**
         * Checks the interval tree for intervals that are the same and stores them in a list
         * @param section - section to check
         * @param intervalTree - interval tree to look over
         * @returns {Array} a list of section classTitles that conflict
         */
        this.getConflictingSections = function (section, intervalTree) {
            let ret = new Set();
            for (let subsection of section) {
                if(subsection.timeInterval == null) {
                    console.log(subsection);
                }

                let conflictingSection = intervalTree.contains(subsection.timeInterval);
                if (conflictingSection !== null)
                    ret.add(conflictingSection);
            }
            return Array.from(ret);
        };

        /**
         * Remove section from the interval tree
         * @param section - section we want to remove
         * @param intervalTree - tree we are operating on
         */
        this.removeSection = function (section, intervalTree) {
            for (let subsection of section) {
                // only remove the subsections that have the same class title
                intervalTree.remove(subsection.timeInterval, subsection.classTitle);
            }
        };

        /**
         * Increment the update count and update the progress bar if we are past a certain
         * threshold
         * @param val the amount we want to increment by =
         */
        this.incrementProgress = function (val) {
            // doing stuff for progress bar for schedules
            this.batchedUpdates += val;
            if (this.batchedUpdates > 10) {
                postMessage({type: "INCREMENT_PROGRESS", amount: this.batchedUpdates});
                this.batchedUpdates = 0;
            }
        };

        /**
         * On the case in which we failed to add a class, get all the sections that conflicted upon addition
         * and update the undirected graph (represented as a dictionary) with the class titles
         * @param sectionFailedToAdd - self explanatory
         * @param sectionConflicts - list of class titles that conflicted
         */
        this.handleFailedToAdd = function (sectionFailedToAdd, sectionConflicts) {
            if (sectionFailedToAdd.length < 1)
                return;
            // make sure there are conflicts just in case
            if (sectionConflicts.length < 1)
                return;

            let failedClassTitle = sectionFailedToAdd[0].classTitle;
            // no source vertex as
            if (!(failedClassTitle in this.errorMap))
                this.errorMap[failedClassTitle] = new Set();

            sectionConflicts.forEach(conflict => {
                // mapping one part of source
                this.errorMap[failedClassTitle].add(conflict)

                // have to add failedClassTitle to other sources too
                if(!(conflict in this.errorMap))
                    this.errorMap[conflict] = new Set();

                this.errorMap[conflict].add(failedClassTitle);
            });
        };

        this.updateProgressForFailedAdd = function (classData, curIndex) {
            let failedSchedules = 1;
            // getting all classes that could have been part of this generationResult
            for (let i = curIndex + 1; i < classData.length; i++) {
                failedSchedules *= classData[i].length;
            }
            // incrementing for them because we know they failed
            this.incrementProgress(failedSchedules);
        };

        this._dfs = function (classData, currentSchedule, intervalTree, schedules, conflicts, counter) {
            if (counter >= classData.length) {
                let score = this.evaluateSchedule(currentSchedule);
                schedules.push([score, currentSchedule]);

                this.incrementProgress(1);
                //console.info(this.numSchedules);
                //this.dispatchProgressFunction(schedulePercentComplete);
                return;
            }

            let currentClassGroup = classData[counter];

            // in the case that a class has all TBA for day or time
            if(currentClassGroup.length === 0) {
                this._dfs(classData, currentSchedule, intervalTree, schedules, conflicts, counter + 1);
            }

            for (let i = 0; i < currentClassGroup.length; i++) {
                // current class group has all the sections for CSE 11
                // this will be an array of sections
                // so [[class, class] , [class, class]]

                // current section
                let currentSection = currentClassGroup[i];
                let filteredSection = ignoreSubsections(currentSection, conflicts);

                // check if we have any time conflicts on adding all the subsections
                let conflictsForSection = this.getConflictingSections(filteredSection, intervalTree);
                // if we have any conflicts at all that mean the section cannot be added
                if (conflictsForSection.length > 0) {
                    this.handleFailedToAdd(filteredSection, conflictsForSection);
                    this.updateProgressForFailedAdd(classData, counter);
                    continue;
                }

                // adding subsections to interval tree if they are all valid
                this.addSection(filteredSection, intervalTree);

                // choosing to use this for our current generationResult - use the actual section not what was filtered
                // this is so that the result has all the correct subsections, but we operate with the filtered sections
                let copySchedule = currentSchedule.slice();
                copySchedule.push(currentSection);
                this._dfs(classData, copySchedule, intervalTree, schedules, conflicts, counter + 1);

                // removing all intervals we added so can continue to DFS
                this.removeSection(filteredSection, intervalTree);
            }
        };

        this.dfs = function (classData, conflicts) {
            let schedules = [];
            this._dfs(classData, [], new SimpleIntervalTree(), schedules, conflicts, 0);

            // schedules is now populated with data
            schedules = schedules.sort((scheduleArr1, scheduleArr2) => {
                if (scheduleArr1[0] > scheduleArr2[0]) return -1; else return 1;
            });

            // convert all of the sets in the error map to lists
            Object.keys(this.errorMap).forEach(errorKey => this.errorMap[errorKey] = Array.from(this.errorMap[errorKey]));

            let errors = this.errorMap;

            schedules = schedules.slice(0, 10);
            schedules = schedules.map(el => new Schedule(el[1]));

            if (schedules.length > 0) {
                errors = {};
            }
            // only really care about errors if we failed to generate a generationResult
            return new GenerationResult(schedules, errors);
        };

        this.generateSchedule = function (classData, conflicts = [], preferences = []) {
            //this.dispatchProgressFunction = dispatchProgressFunction;
            this.numSchedules = 0;
            this.totalPossibleSchedules = 1;

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

    this.initPreferences = preferences => {
        return preferences.map(preference => {
            if (preference.type) {
                switch (preference.type) {
                    case "DAY":
                        return new DayPreference(preference.days);
                    case "TIME":
                        return new TimePreference(preference.start, preference.end);
                    case "PRIORITY":
                        let modifiedPreferences = preference.preferences;
                        for (let i = 0; i < modifiedPreferences.length; i++) {
                            let modPref = modifiedPreferences[i];
                            switch (modifiedPreferences[i].type) {
                                case "INSTRUCTOR":
                                    modifiedPreferences[i] = new InstructorPreference(modPref.Class, modPref.instructor);
                                    break;
                            }
                        }
                        return new PriorityModifier(preference.Class, modifiedPreferences, preference.priority);
                }
            }
        });
    };

    this.onmessage = evt => {
        if (!evt)
            return;
        let data = evt.data;

        let worker = new SGWorker();
        let {classData, conflicts, preferences} = data;
        let realPreferences = this.initPreferences(preferences);

        let results = worker.generateSchedule(classData, conflicts, realPreferences);
        // returns a promise
        postMessage({
            type: "FINISHED_GENERATION",
            generationResult: results
        });
    }
}
