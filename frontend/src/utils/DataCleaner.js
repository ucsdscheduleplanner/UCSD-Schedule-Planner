import {Class} from "./class/Class";
import {Section} from "./class/Section";
import {Subsection} from "./class/Subsection";

export class DataCleaner {
    /**
     *
     * @param data is an object with each key as a course name, and its
     * elements are the sections
     **/
    static clean(data) {
        // ret is a list of classes
        let ret = [];

        for (let courseName of Object.keys(data)) {
            let currentClass = new Class();
            currentClass.title = courseName;

            let slowPtr = 0;
            let fastPtr = 0;

            // all the data for the current class
            let copyCourseData = data[courseName].slice();

            // using this as a delimiter to know the end
            copyCourseData.push({"SECTION_ID": null});

            while (fastPtr < copyCourseData.length) {
                let slowSectionID = copyCourseData[slowPtr]["SECTION_ID"];
                let fastSectionID = copyCourseData[fastPtr]["SECTION_ID"];

                if (slowSectionID !== fastSectionID) {
                    // this means we have found a new section of a class
                    let currentSection = new Section();
                    // augmenting section with title
                    currentSection.classTitle = courseName;
                    // inclusive exclusive for bounds
                    let subsections = copyCourseData.slice(slowPtr, fastPtr);

                    // the fact we are in this if condition means there is at least one subsection
                    DataCleaner._initClass(currentClass, subsections[0]);
                    DataCleaner._initSection(currentSection, subsections[0]);

                    for (let i = 0; i < subsections.length; i++) {
                        let subsection = new Subsection(subsections[i]);
                        if (DataCleaner._isValidSubsection(subsection)) {
                            currentSection.subsections.push(subsection);
                        }
                    }

                    slowPtr = fastPtr;
                    // putting al the section data in the class
                    currentClass.sections.push(currentSection);
                }

                fastPtr++; }
            // we have put all the data into the classes
            ret.push(currentClass);
        }
        // no alterations to input
        return ret;
    }

    static _initSection(currentSection, subsection) {
        // due to a screw up here with Cameron, section id is actually which NUMBER the section is (our own counting)
        // and course_id is the section ID
        let {SECTION_ID, COURSE_ID} = subsection;
        DataCleaner._setSectionProperty(currentSection, "sectionNum", SECTION_ID);
        DataCleaner._setSectionProperty(currentSection, "id", COURSE_ID);
    }

    /**
     * Will initialize the current class with the information from the subsection
     * @param currentClass
     * @param subsection
     */
    static _initClass(currentClass, subsection) {
        let {DEPARTMENT, COURSE_NUM, DESCRIPTION} = subsection;

        console.log(`Setting class ${currentClass.title} with data.`);
        DataCleaner._setClassProperty(currentClass, "department", DEPARTMENT);
        DataCleaner._setClassProperty(currentClass, "number", COURSE_NUM);
        DataCleaner._setClassProperty(currentClass, "description", DESCRIPTION);
    }

    static _setClassProperty(currentClass, property, newVal) {
        if(currentClass[property] && currentClass[property] !== newVal)
            console.warn(`Property ${property} already set on class ${currentClass.title} with value ${currentClass[property]},
            replacing with ${newVal}`);
        currentClass[property] = newVal;
    }

    static _setSectionProperty(currentSection, property, newVal) {
        if(currentSection[property] && currentSection[property] !== newVal)
            console.warn(`Property ${property} already set on section with value ${currentSection[property]}. Replacing with ${newVal}`);
        currentSection[property] = newVal;
    }

    static _isValidSubsection(subsection) {
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
}
