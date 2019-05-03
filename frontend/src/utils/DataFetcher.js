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


const COURSE_NUM_CACHE_STR = '{0}_course_nums';
const INSTRUCTOR_CACHE_STR = '{0}_{1}_instructor';
const TYPE_CACHE_STR = '{0}_{1}_type';

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
                classesToFetch.push(
                    {
                        quarter: "SP19",
                        department: Class.department,
                        courseNum: Class.courseNum
                    }
                );
            }
        }

        let ret = {};
        await DataFetcher.getDataFromCache(ret, cachedClasses);

        // we can finish if all our classes were cached
        if (classesToFetch.length === 0) return ret;

        let fetchBody = JSON.stringify(classesToFetch);
        let response = await fetch(`${BACKEND_URL}/api_class_data`, {
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

        let response = await fetch(`${BACKEND_URL}/api_departments`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'get',
        });
        let departments = await response.json();
        await CacheManager.get().cache('departments', departments);
        return departments;
    }

    /**
     * Gets the course numbers for the given department
     */
    static async fetchCourseNums(department) {
        // no fetch if in cache
        let isCached = await CacheManager.get().isCached(
            COURSE_NUM_CACHE_STR.formatUnicorn(department),
        );

        if (isCached) {
            console.log(`Hit caching level for department ${department}`);
            return await CacheManager.get().getFromCache(
                COURSE_NUM_CACHE_STR.formatUnicorn(department),
            );
        }

        let response = await fetch(
            `${BACKEND_URL}/api_course_nums?department=${department}&quarter=SP19`,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'get',
            },
        );

        let responseJSON = await response.json();
        let unsorted = responseJSON.map(obj => obj.courseNum);
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

        // cache for the next time we want to query
        await CacheManager.get().cache(
            COURSE_NUM_CACHE_STR.formatUnicorn(department),
            sortedCourseNums,
        );

        return sortedCourseNums;
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

    static async fetchInstructors(department, courseNum) {
        // no fetch if in cache
        let isCached = await CacheManager.get().isCached(
            INSTRUCTOR_CACHE_STR.formatUnicorn(department, courseNum),
        );

        if (isCached) {
            console.log(`Cache hit for instructors for class ${department} ${courseNum}`);
            return await CacheManager.get().getFromCache(
                INSTRUCTOR_CACHE_STR.formatUnicorn(department, courseNum),
            );
        }

        let response = await fetch(
            `${BACKEND_URL}/api_instructors?department=${department}&courseNum=${courseNum}&quarter=SP19`,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'get',
            },
        );

        let instructors = await response.json();
        // cache for the next time we want to query
        await CacheManager.get().cache(
            INSTRUCTOR_CACHE_STR.formatUnicorn(department),
            instructors
        );

        return instructors;
    }

    static async fetchTypes(department, courseNum) {
        // no fetch if in cache
        let isCached = await CacheManager.get().isCached(
            TYPE_CACHE_STR.formatUnicorn(department, courseNum),
        );

        if (isCached) {
            console.log(`Cache hit for instructors for class ${department} ${courseNum}`);
            return await CacheManager.get().getFromCache(
                TYPE_CACHE_STR.formatUnicorn(department, courseNum),
            );
        }

        let response = await fetch(
            `${BACKEND_URL}/api_types?department=${department}&courseNum=${courseNum}&quarter=SP19`,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'get',
            },
        );

        let types = await response.json();
        // cache for the next time we want to query
        await CacheManager.get().cache(
            TYPE_CACHE_STR.formatUnicorn(department),
            types
        );

        return types;
    }
}
