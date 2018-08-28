export function SGWorkerCode() {
    function PriorityModifier(Class = null, preferences, priority) {
        this.Class = Class;
        this.classTitle = Class.classTitle;
        // list of different preference objects
        this.preferences = preferences;
        this.priority = priority;

        this.evaluate = (classToEvaluate) => {
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
        this.evaluate = (classToEvaluate) => {
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
     * Because this is a general schedule preference we don't need any specific classes
     * @constructor
     * @param start
     * @param end
     */
    function TimePreference(start, end) {
        this.start = new Date();
        this.start.setHours(start.getHours(), start.getMinutes(), 0);

        this.end = new Date();
        this.end.setHours(end.getHours(), end.getMinutes(), 0);

        this.evaluate = (classToEvaluate) => {
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
                    if (rangeStart => this.start && rangeEnd <= this.end) {
                        score += 20;
                    }
                }
            }
            return score;
        }
    }

    function DayPreference(days) {
        this.days = days;

        this.evaluate = (classToEvaluate) => {
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


    function SimpleIntervalTreeNode(interval) {
        this.interval = interval;
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

        this.add = function (interval) {
            // converting into a node
            let prevSize = this.size;
            this.root = this.insert(this.root, interval);
            let afterSize = this.size;
            return afterSize === prevSize + 1;
        };

        this.insert = function (node, interval) {
            if (node === null) {
                this.size++;
                return new SimpleIntervalTreeNode(interval);
            }
            if (node.before(interval)) {
                node.right = this.insert(node.right, interval);
            } else if (node.after(interval)) {
                node.left = this.insert(node.left, interval);
            }
            return node;
        };

        this._copy = function (node) {
            if (node === null) return null;
            let copyNode = new SimpleIntervalTreeNode(node.interval);
            copyNode.left = this._copy(node.left);
            copyNode.right = this._copy(node.right);
            return copyNode;
        };

        this.copy = function () {
            return this._copy(this.root);
        };

        this.remove = function (interval) {
            this.root = this.removeNode(this.root, interval);
        };

        this.removeNode = function (node, interval) {
            if (node === null) return null;
            if (node.interval === interval) {
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
                        lagPointer.right = this.removeNode(fastPointer, fastPointer.interval);
                    } else {
                        // otherwise it is to the left and we can remove from the left
                        lagPointer.left = this.removeNode(fastPointer, fastPointer.interval);
                    }
                    this.size++;
                    fastPointer.left = node.left;
                    fastPointer.right = node.right;
                    // return the fast pointer to indicate that we have shifted it up
                    return fastPointer;
                }
            } else {
                if (node.before(interval)) {
                    node.right = this.removeNode(node.right, interval);
                } else if (node.after(interval)) {
                    node.left = this.removeNode(node.left, interval);
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
     * Will hold the actual schedule and any errors that come up
     * @param schedule
     * @param errors
     * @constructor
     */
    function Schedule(schedule, errors) {
        this.classes = schedule;
        this.errors = errors;
    }

    function SGWorker() {
        this.failedAdditions = {};

        this.batchedUpdates = 0;

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

        this.addSection = function (section, intervalTree) {
            for (let subsection of section) {
                intervalTree.add(subsection.timeInterval);
            }
        };

        this.removeSection = function (section, intervalTree) {
            for (let subsection of section) {
                intervalTree.remove(subsection.timeInterval);
            }
        };

        this.incrementProgress = function (val) {
            // doing stuff for progress bar for schedules
            this.batchedUpdates+=val;
            console.log(this.batchedUpdates);
            if(this.batchedUpdates > 10) {
                postMessage({type: "INCREMENT_PROGRESS", by: this.batchedUpdates});
                this.batchedUpdates = 0;
            }
        };

        this.handleFailedToAdd = function (section) {
            if (section.length <= 0)
                return;

            if (!this.failedAdditions.hasOwnProperty(section[0].classTitle))
                this.failedAdditions[section[0].classTitle] = 0;
            this.failedAdditions[section[0].classTitle]++;
        };

        this.updateProgressForFailedAdd = function (classData, curIndex) {
            let failedSchedules = 1;
            // getting all classes that could have been part of this schedule
            for (let i = curIndex + 1; i < classData.length; i++) {
                failedSchedules *= classData[i].length;
            }
            // incrementing for them because we know they failed
            this.incrementProgress(failedSchedules);
        };

        this._dfs = function (classData, currentSchedule, intervalTree, schedules, conflicts, counter) {
            if (currentSchedule.length >= classData.length) {
                let score = this.evaluateSchedule(currentSchedule);
                schedules.push([score, currentSchedule]);

                this.incrementProgress(1);
                //console.info(this.numSchedules);
                //this.dispatchProgressFunction(schedulePercentComplete);

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

                if (!this.canAddSection(filteredSection, intervalTree)) {
                    this.handleFailedToAdd(filteredSection);
                    this.updateProgressForFailedAdd(classData, counter);
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
            //this.dispatchProgressFunction(100);

            let classes = [];
            if (schedules.length > 0) {
                classes = schedules[0][1];
            }
            return new Schedule(classes, this.failedAdditions);
        };

        this.generateSchedule = function (classData, conflicts = [], preferences = [], dispatchProgressFunction) {
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

        let schedule = worker.generateSchedule(classData, conflicts, realPreferences);
        // returns a promise
        postMessage({
            type: "FINISHED_GENERATION",
            schedule: schedule
        });
    }
}
