export default class ClassUtils {


    static getSectionsFor(classTitle, classData) {
        return this.getClassDataFor(classTitle, classData) ?
            this.getClassDataFor(classTitle, classData).sections : null;
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

}
