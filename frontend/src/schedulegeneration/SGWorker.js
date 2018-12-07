// the code that goes into the web worker
import {TimePreference} from "../utils/Preferences";

export function SGWorkerCode() {
    this.onmessage = function (evt) {
        console.log("Got here");
        if (!evt)
            return;
        let data = evt.data;

        console.log(data);

        let {classData, conflicts, preferences} = data;
        preferences = initPreferences(preferences);

        let worker = new ScheduleGenerator(classData, conflicts, preferences);

        // have to convert from JSON preferences to preference objects

        let results = worker.generate();
        // returns a promise
        postMessage({
            type: "FINISHED_GENERATION",
            generationResult: results
        });
    };


    /**
     * Testing seam
     * @param data input data
     * @returns {GenerationResult}
     */
    this.generate = function (data) {
        let worker = new ScheduleGenerator();
        let {classData, conflicts, preferences} = data;
        // have to convert crom JSOn preferences to preference objects
        preferences = initPreferences(preferences);

        return worker.generate(classData, conflicts, preferences);
    };

    function initPreferences(preferences) {
        return preferences.map(preference => {
            if (preference.type) {
                switch (preference.type) {
                    case "DAY":
                        return new DayPreference(preference.days);
                    case "TIME":
                        return new TimePreference(preference.start, preference.end);
                    //return new TimePreference(preference.start, preference.end);
                    case "PRIORITY":
                        let modifiedPreferences = preference.preferences;
                        for (let i = 0; i < modifiedPreferences.length; i++) {
                            let modPref = modifiedPreferences[i];
                            switch (modifiedPreferences[i].type) {
                                case "INSTRUCTOR":
                                    modifiedPreferences[i] = new InstructorPreference(modPref.Class, modPref.instructor);
                                    break;
                                default:
                                    return null;
                            }
                        }
                        return new PriorityModifier(preference.Class, modifiedPreferences, preference.priority);
                    default:
                        return null;
                }
            }
            return null;
        });
    }

    function PriorityModifier(Class = null, preferences, priority) {
        this.Class = Class;
        this.classTitle = Class.classTitle;
        // list of different preference objects
        this.preferences = preferences;
        this.priority = priority;

        PriorityModifier.prototype.evaluate = function (classToEvaluate) {
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
        InstructorPreference.prototype.evaluate = function (classToEvaluate) {
            let output = 0;
            if (classToEvaluate.length === 0) {
                return output;
            }

            // can just get the first one because we are only looking at instructors
            // and they all have the same instructor
            let subsection = classToEvaluate[0];
            if (subsection.classTitle === this.Class.classTitle) {
                if (subsection.instructor === this.Class.instructor) {
                    output = 10;
                } else {
                    output = -3;
                }
            }
            return output;
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

        TimePreference.prototype.evaluate = function (classToEvaluate) {
            if (classToEvaluate.length === 0) {
                return 0;
            }

            let score = 0;
            for (let subsection of classToEvaluate.subsections) {
                // this shouldn't happen but if it does punish hardcore
                if (!subsection.timeInterval) {
                    score -= 99;
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
                    score += 1;
                    // the range is inside our desired range!
                    if (rangeStart >= this.start && rangeEnd <= this.end) {
                        score += 3;
                    }
                }
            }
            console.log("Time preference score" + score);
            return score;
        }
    }

    function DayPreference(days) {
        this.days = days;

        DayPreference.prototype.evaluate = function (classToEvaluate) {
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
     * Will hold the actual generationResult and any errors that come up
     * @param schedule
     * @param errors
     * @constructor
     */
    function Schedule(schedule) {
        this.classes = schedule;
    }

    /**
     * Stores the generated schedules and any errors that occurred
     */
    function GenerationResult(schedules, errors) {
        this.schedules = schedules;
        this.errors = errors;
    }

    function ScheduleGenerator(classData = [], conflicts = [], preferences = []) {
        // error map represents an undirected graph where (u,v) exists in edge set E iff u is incompatible with v
        // key is u, value is list of v in which above relationship holds
        this.errorMap = {};

        // holds the number of completed schedules that were generated
        // includes the ones that failed to generate
        this.batchedUpdates = 0;

        this.classData = classData;
        this.conflicts = conflicts;
        this.preferences = preferences;

        // an interval tree for generating schedules
        this.intervalTree = new SimpleIntervalTree();

        /**
         *
         * @param section
         * @param conflicts is a dictionary with that maps class titles to the sections to ignore
         */
        ScheduleGenerator.prototype.ignoreSubsections = function (section) {
            if (!section || section.subsections.length === 0) {
                return section;
            }

            let firstSubsection = section.subsections[0];
            if (!(firstSubsection.classTitle in this.conflicts)) {
                return section;
            }

            let conflictsForClassTitle = this.conflicts[firstSubsection.classTitle];
            return section.filter(s => !conflictsForClassTitle.includes(s.type));
        };


        /**
         * Adds all the subsections of the given section to the interval tree
         * @param section - section we want to add
         * @param intervalTree - interval tree we are adding to
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
         * @param intervalTree - interval tree to look over
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
         * @param intervalTree - tree we are operating on
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
            // doing stuff for progress bar for schedules
            this.batchedUpdates += val;
            if (this.batchedUpdates > 10) {
                postMessage({type: "INCREMENT_PROGRESS", amount: this.batchedUpdates});
                this.batchedUpdates = 0;
            }
        };

        /**
         * Gets the section object for the class given the sectionNum identification field
         * @param sectionNum the field that identifies which section, CSE11$0,
         */
        ScheduleGenerator.prototype.getSectionFor = function (sectionNum) {
            // splitting the string based on info
            const title = sectionNum.split("$")[0];

            for (let Class of this.classData) {
                if (title.startsWith(Class.department)) {
                    for (let section of Class.sections) {
                        if (section.sectionNum === sectionNum)
                            return section;
                    }
                }
            }
        };

        // I wrote this cause I had to don't judge me future person (probably Cameron)
        ScheduleGenerator.prototype.buildClass = function (section) {
            console.log(section);
            for (let Class of this.classData) {
                if (section.sectionNum.startsWith(Class.department)) {
                    for (let compare of Class.sections) {
                        if (section.sectionNum === compare.sectionNum) {
                            return Object.assign({}, Class, {sections: [section]});
                        }
                    }
                }
            }
        };

        /**
         * Will evaluate the given schedule with the preference objects given
         */
        ScheduleGenerator.prototype.evaluateSchedule = function (schedule) {
            let score = 0;
            for (let classSection of schedule) {
                for (let preference of this.preferences) {
                    score += preference.evaluate(this.getSectionFor(classSection));
                }
            }
            return score;
        };

        /**
         * On the case in which we failed to add a class, get all the sections that conflicted upon addition
         * and update the undirected graph (represented as a dictionary) with the class titles
         * @param sectionFailedToAdd - self explanatory
         * @param sectionConflicts - list of class titles that conflicted
         */
        ScheduleGenerator.prototype.handleFailedToAdd = function (sectionFailedToAdd, sectionConflicts) {
            if (sectionFailedToAdd.length < 1)
                return;
            // make sure there are conflicts just in case
            if (sectionConflicts.length < 1)
                return;

            let failedClassTitle = sectionFailedToAdd.courseNum;
            // no source vertex as
            if (!(failedClassTitle in this.errorMap))
                this.errorMap[failedClassTitle] = new Set();

            sectionConflicts.forEach(conflict => {
                // mapping one part of source
                this.errorMap[failedClassTitle].add(conflict);

                // have to add failedClassTitle to other sources too
                if (!(conflict in this.errorMap))
                    this.errorMap[conflict] = new Set();

                this.errorMap[conflict].add(failedClassTitle);
            });
        };

        ScheduleGenerator.prototype.updateProgressForFailedAdd = function (curClassIndex) {
            let failedSchedules = 1;
            // getting all classes that could have been part of this generationResult
            for (let i = curClassIndex + 1; i < this.classData.length; i++) {
                failedSchedules *= this.classData[i].length;
            }
            // incrementing for them because we know they failed
            this.incrementProgress(failedSchedules);
        };

        ScheduleGenerator.prototype.dfs = function (result, currentSchedule = [], numClassesAdded = 0) {
            console.log("Current schedule is " + currentSchedule);
            console.log(numClassesAdded);
            if (numClassesAdded >= this.classData.length) {
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

                // will remove subsections that have been ignored from consideration
                let filteredSection = this.ignoreSubsections(currentSection);
                // check if we have any time conflicts on adding all the subsections
                // (NOTE) goes off the assumption that there are no conflicts within the class - that
                // was proven to be incorrect
                let conflictsForSection = this.getConflictingSections(filteredSection);
                console.log("Conflicting sections ");
                console.log(conflictsForSection);
                // if we have any conflicts at all that mean the section cannot be added
                if (conflictsForSection.length > 0) {
                    this.handleFailedToAdd(filteredSection, conflictsForSection);
                    this.updateProgressForFailedAdd(numClassesAdded);
                    continue;
                }

                // adding subsections to interval tree if they are all valid
                this.addSection(filteredSection);

                currentSchedule.push(currentSection.sectionNum);
                // choosing to use this for our current generationResult - use the actual section not what was filtered
                // this is so that the result has all the correct subsections, but we operate with the filtered sections
                this.dfs(result, currentSchedule, numClassesAdded + 1);

                // remove after done
                currentSchedule.pop();
                // removing all intervals we added so can continue to DFS
                this.removeSection(filteredSection);
            }
        };

        ScheduleGenerator.prototype.generate = function () {
            let schedules = [];
            this.dfs(schedules);

            // schedules is now populated with data
            schedules = schedules.sort((scheduleArr1, scheduleArr2) => {
                if (scheduleArr1[0] > scheduleArr2[0]) return -1; else return 1;
            });

            // get the top 5
            schedules = schedules.slice(0, 6);
            // schedules is an array of tuples where arr[0] is the score and arr[1] is the list of sections
            schedules = schedules.map(arr => {
                return arr[1].map(sectionNum => this.buildClass(this.getSectionFor(sectionNum)));
            });

            // convert all of the sets in the error map to lists
            Object.keys(this.errorMap)
                .forEach(errorKey => this.errorMap[errorKey] = Array.from(this.errorMap[errorKey]));

            let errors = this.errorMap;

            if (schedules.length > 0) {
                errors = {};
            }

            // only really care about errors if we failed to generate a generationResult
            let ret = new GenerationResult(schedules, errors);
            console.log(ret);
            return ret;
        }
    }
}
