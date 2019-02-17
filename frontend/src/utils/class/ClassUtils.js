import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment);

export default class ClassUtils {


    static getSectionsFor(classTitle, classData) {
        return this.getClassDataFor(classTitle, classData) ?
            this.getClassDataFor(classTitle, classData).sections : null;
    }

    static getSubsectionsFor(sectionNum, classData) {
        for (let Class of classData) {
            const formattedClassTitle = ClassUtils.formatClassTitle(Class.title);
            const formattedSectionNum = ClassUtils.formatSectionNum(sectionNum);

            if (formattedClassTitle === formattedSectionNum) {
                for (let curSection of Class.sections) {
                    if (sectionNum === curSection.sectionNum) {
                        // don't want to copy the previous sections field, only want the new one
                        return [...curSection.subsections]
                    }
                }
            }
        }
        return [];
    }

    static getClassDataFor(classTitle, classData) {
        for (let i = 0; i < classData.length; i++) {
            if (classData[i].title === classTitle)
                return classData[i];
        }
        return null;
    }

    static getClassFor(transactionID, selectedClasses) {
        if (selectedClasses[transactionID])
            return selectedClasses[transactionID];
        else return null;
    }

    static getTransactionIDForClass(classTitle, selectedClasses) {
        let classes = Object.values(selectedClasses);
        for (let i = 0; i < classes.length; i++) {
            if (classes[i].classTitle === classTitle)
                return classes[i].transactionID;
        }
        return null;
    }

    static getClassForSectionNum(sectionNum, classData) {
        for (let Class of classData) {
            const formattedClassTitle = ClassUtils.formatClassTitle(Class.title);
            const formattedSectionNum = ClassUtils.formatSectionNum(sectionNum);

            if (formattedClassTitle === formattedSectionNum) {
                return Class;
            }
        }
        return null;
    }

    static convertToMomentRange(timeInterval) {
        if (timeInterval === null)
            return null;
        let start = timeInterval.start;
        let end = timeInterval.end;

        if (start && end) {
            start = moment(start);
            end = moment(end);
        } else {
            console.warn("Start or end are not valid");
            console.warn(start);
            console.warn(end);
        }

        return moment.range(start, end);
    }

    /**
     * Returns info about an event - not an event object itself
     */
    static getEventInfo(schedule, classData) {
        const ret = [];
        for (let sectionNum of schedule) {
            let Class = ClassUtils.getClassForSectionNum(sectionNum, classData);

            if (!Class || Class.sections.length === 0)
                continue;

            for (let section of Class.sections) {
                if(section.sectionNum !== sectionNum)
                    continue;

                for (let subsection of section.subsections) {
                    let strippedClassData = Object.assign({}, Class, {sections: []});
                    let strippedSectionData = Object.assign({}, section, {subsections: []});
                    let timeRange = ClassUtils.convertToMomentRange(subsection.timeInterval);

                    ret.push({
                        content: strippedSectionData.classTitle,
                        ...strippedClassData,
                        ...strippedSectionData,
                        ...subsection,
                        range: timeRange
                    });
                }
            }
        }
        return ret;
    }

    // I wrote this cause I had to don't judge me future person (probably Cameron)
    /**
     * Builds a class object after done with generation, copying over all the data from the previous class
     * object but overwriting the sections field to replace it with only one section
     * @param sectionNum the section number of the class I want to replace
     * @param classData the data
     * @returns {any}
     */
        // TODO speed up this method for gods sake
    static buildClass = function (sectionNum, classData) {
        for (let Class of classData) {
            const formattedClassTitle = ClassUtils.formatClassTitle(Class.title);
            const formattedSectionNum = ClassUtils.formatSectionNum(sectionNum);

            if (formattedClassTitle === formattedSectionNum) {
                for (let curSection of Class.sections) {
                    if (sectionNum === curSection.sectionNum) {
                        // don't want to copy the previous sections field, only want the new one
                        return Object.assign({}, Class, {sections: [curSection]});
                    }
                }
            }
        }
        return null;
    };

    static formatSectionNum(sectionNum) {
        return sectionNum.substring(0, sectionNum.indexOf("$"));
    }

    static formatClassTitle(classTitle) {
        return classTitle.replace(/\s+/g, '');
    }
}
