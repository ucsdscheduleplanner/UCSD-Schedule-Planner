// @format
/**
 * Function requests data from the backend given a list of classes that the user has picked. Implements caching as well
 * using local storage to reduce fetch size and hopefully speed up application.
 *
 * @param selectedClasses A list of pseudo class objects, not subsection objects, but bare Class objects.
 * @returns An object where each key is an element of the array of classes passed in and the value is an array
 * of subsections belonging to that class
 */
import {BACKEND_URL} from '../settings';
import {CacheManager} from './CacheManager';


// used for ordering class types by priority
const codeKeyToVal = {
    AC_KEY: 6,
    CL_KEY: 6,
    CO_KEY: 6,
    DI_KEY: 7,
    FI_KEY: 10,
    FM_KEY: 6,
    FW_KEY: 6,
    IN_KEY: 6,
    IT_KEY: 6,
    LA_KEY: 8,
    LE_KEY: 1,
    MI_KEY: 9,
    MU_KEY: 9,
    OT_KEY: 6,
    PB_KEY: 6,
    PR_KEY: 6,
    RE_KEY: 6,
    SE_KEY: 6,
    ST_KEY: 6,
    TU_KEY: 6,
};

// eslint-disable-next-line
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
    function () {
        let str = this.toString();
        if (arguments.length) {
            const t = typeof arguments[0];
            let key;
            let args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }

        return str;
    };


const CLASS_SUMMARY_CACHE_STR = '{0}_summary';

function addToSet(set, iterable) {
    for (const el of iterable) {
        set.add(el);
    }
}

export class DataFetcher {
    static async fetchClassData(selectedClasses) {
        let classesToFetch = [];
        let cachedClasses = [];

        for (let Class of selectedClasses) {
            let isCached = await CacheManager.get().isCached(Class.classTitle);
            if (isCached) {
                cachedClasses.push(Class.classTitle);
            } else {
                classesToFetch.push(Class);
            }
        }

        let ret = {};
        await DataFetcher.getDataFromCache(ret, cachedClasses);

        // we can finish if all our classes were cached
        if (classesToFetch.length === 0) return ret;

        let fetchBody = JSON.stringify({classes: classesToFetch});
        let response = await fetch(`${BACKEND_URL}/api_data`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'post',
            body: fetchBody,
        });
        // response JSON is an object where each key is a class from selectedClasses (if cache was not hit)
        // and the value is an array of subsections for that Class
        let responseJSON = await response.json();

        for (let classTitle of Object.keys(responseJSON)) {
            // appending to ret
            ret[classTitle] = responseJSON[classTitle];
            await CacheManager.get().cache(classTitle, responseJSON[classTitle]);
        }

        return ret;
    }

    /**
     * Fetch all the departments in the course catalog
     * @returns {Promise} a promise of a list of the departments
     */
    static async fetchDepartments() {
        let isCached = await CacheManager.get().isCached('departments');
        if (isCached) {
            return await CacheManager.get().getFromCache('departments');
        }

        let response = await fetch(`${BACKEND_URL}/api_department`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'get',
        });
        let responseJSON = await response.json();
        let departments = Object.values(responseJSON).map(
            resObj => resObj['DEPT_CODE'],
        );
        await CacheManager.get().cache('departments', departments);
        return departments;
    }

    /**
     * Gets the course numbers, the instructors and the
     */
    static async fetchClassSummaryFor(department) {
        // no fetch if in cache
        console.log("STARTED");
        let isCached = await CacheManager.get().isCached(
            CLASS_SUMMARY_CACHE_STR.formatUnicorn(department),
        );

        console.log("GOT HERE");
        if (isCached) {
            console.log(`Hit caching level for department ${department}`);
            return await CacheManager.get().getFromCache(
                CLASS_SUMMARY_CACHE_STR.formatUnicorn(department),
            );
        }

        console.log("GOT BAD");
        let response = await fetch(
            `${BACKEND_URL}/api_classes?department=${department}`,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'get',
            },
        );


        let responseJSON = await response.json();
        let classSummaryData = responseJSON['CLASS_SUMMARY'];
        // putting the response inside unsorted list
        let unsorted = new Set();
        let classTypesPerClass = {};
        let instructorsPerClass = {};
        let descriptionsPerClass = {};

        // classArrKey is the course num
        for (let classArrKey of Object.keys(classSummaryData)) {
            // classArr holds an array of all the subsections of each class
            // for each class subsection, meaning for cse 11 lecture then lab...
            let classArr = classSummaryData[classArrKey];
            instructorsPerClass[classArrKey] = new Set();
            classTypesPerClass[classArrKey] = new Set();
            unsorted.add(classArrKey);

            for (let Class of classArr) {
                let instructors = [...Class['INSTRUCTOR'].split('\n\n')];
                // filter them first before adding
                // just in case we have multiple instructors on one line
                instructors = instructors
                    .filter(instructor => instructor.length > 0)
                    .map(instructor => instructor.trim());
                // adding to set
                addToSet(instructorsPerClass[classArrKey], instructors);

                // should really only be one description per class
                descriptionsPerClass[classArrKey] = Class['DESCRIPTION'].substring(
                    0,
                    Class['DESCRIPTION'].indexOf('('),
                );

                const classType = Class['TYPE'];
                // adding to set
                classTypesPerClass[classArrKey].add(classType);
            }

            // converting back into set
            instructorsPerClass[classArrKey] = [...instructorsPerClass[classArrKey]];
            classTypesPerClass[classArrKey] = [...classTypesPerClass[classArrKey]]
                .sort((a, b) => codeKeyToVal[a] - codeKeyToVal[b]);
        }

        // sorting based on comparator for the course nums
        let sortedCourseNums = [...unsorted].sort((element1, element2) => {
            // match numerically
            let num1 = parseInt(element1.match(/\d+/)[0], 10);
            let num2 = parseInt(element2.match(/\d+/)[0], 10);

            if (num1 < num2) return -1;
            if (num2 < num1) return 1;
            // checking lexicographically if they are the same number
            if (element1 < element2) return -1;
            if (element2 < element1) return 1;
            return 0;
        });

        for (let key of Object.keys(instructorsPerClass)) {
            instructorsPerClass[key] = [...instructorsPerClass[key]];
        }

        let ret = {
            descriptionsPerClass: descriptionsPerClass,
            courseNums: sortedCourseNums,
            classTypesPerClass: classTypesPerClass,
            instructorsPerClass: instructorsPerClass,
        };

        // cache for the next time we want to query
        await CacheManager.get().cache(
            CLASS_SUMMARY_CACHE_STR.formatUnicorn(department),
            ret,
        );

        console.log("FINISHED");
        return ret;
    }

    static async getDataFromCache(ret, cachedClasses) {
        // goes through the cached classes and fills it in the return object
        for (let cachedClassKey of cachedClasses) {
            console.log(`Caching layer has been hit for ${cachedClassKey}`);
            ret[cachedClassKey] = await CacheManager.get().getFromCache(
                cachedClassKey,
            );
        }
    }
}
