/**
 * Function requests data from the backend given a list of classes that the user has picked. Implements caching as well
 * using local storage to reduce fetch size and hopefully speed up application.
 *
 * @param selectedClasses A list of pseudo class objects, not subsection objects, but bare Class objects.
 * @returns An object where each key is an element of the array of classes passed in and the value is an array
 * of subsections belonging to that class
 */
import {BACKEND_URL} from "../settings";
import {CacheManager} from "./CacheManager";

const codeToClassType = {
    "AC": "Activity",
    "CL": "Clinical Clerkship",
    "CO": "Conference",
    "DI": "Discussion",
    "FI": "Final Exam",
    "FM": "Film",
    "FW": "Fieldwork",
    "IN": "Independent Study",
    "IT": "Internship",
    "LA": "Lab",
    "LE": "Lecture",
    "MI": "Midterm",
    "MU": "Make-up Session",
    "OT": "Other Additional Meeting",
    "PB": "Problem Session",
    "PR": "Practicum",
    "RE": "Review Session",
    "SE": "Seminar",
    "ST": "Studio",
    "TU": "Tutorial",
};

export const classTypeToCode = {
    "Activity": "AC",
    "Clinical Clerkship": "CL",
    "Conference": "CO",
    "Discussion": "DI",
    "Final Exam": "DI",
    "Film": "FM",
    "Fieldwork": "FW",
    "Independent Study": "IN",
    "Internship": "IT",
    "Lab": "LA",
    "Lecture": "LE",
    "Midterm": "MI",
    "Make-up Session": "MU",
    "Other Additional Meeting": "OT",
    "Problem Session": "PB",
    "Practicum": "PR",
    "Review Session": "RE",
    "Seminar": "SE",
    "Studio": "ST",
    "Tutorial": "TU"
};

const codeKeyToVal = {
    "AC_KEY": 6,
    "CL_KEY": 6,
    "CO_KEY": 6,
    "DI_KEY": 7,
    "FI_KEY": 10,
    "FM_KEY": 6,
    "FW_KEY": 6,
    "IN_KEY": 6,
    "IT_KEY": 6,
    "LA_KEY": 8,
    "LE_KEY": 1,
    "MI_KEY": 9,
    "MU_KEY": 9,
    "OT_KEY": 6,
    "PB_KEY": 6,
    "PR_KEY": 6,
    "RE_KEY": 6,
    "SE_KEY": 6,
    "ST_KEY": 6,
    "TU_KEY": 6,
};

const CLASS_SUMMARY_CACHE_STR = "{0}_summary";

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

        // precompute caching
        for (let cachedClassKey of cachedClasses) {
            console.log(`Caching layer has been hit for ${cachedClassKey}`);
            ret[cachedClassKey] = await CacheManager.get().getFromCache(cachedClassKey);
        }
        // only want to make the fetch if we don't have courseNums cached
        if (classesToFetch.length !== 0) {
            let fetchBody = JSON.stringify({"classes": classesToFetch});
            let response = await
                fetch(`${BACKEND_URL}/api_data`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'post',
                    body: fetchBody
                });
            // response JSON is an object where each key is a class from selectedClasses (if cache was not hit)
            // and the value is an array of subsections for that Class
            let responseJSON = await response.json();

            for (let classTitle of Object.keys(responseJSON)) {
                // appending to ret
                ret[classTitle] = responseJSON[classTitle];
                // have to stringify so can parse it because local storage only takes in key value pairs
                let isCached = await CacheManager.get().isCached(classTitle);
                if (!isCached) {
                    CacheManager.get().cache(classTitle, responseJSON[classTitle]);
                }
            }
        }

        return ret;
    }

    /**
     * Fetch all the departments in the course catalog
     * @returns {Promise} a promise of a list of the departments
     */
    static async fetchDepartments() {
        let isCached = await CacheManager.get().isCached("departments");
        if (isCached) {
            return await CacheManager.get().getFromCache("departments");
        }

        let response = await
            fetch(`${BACKEND_URL}/api_department`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'get'
            });
        let responseJSON = await response.json();
        let departments = Object.values(responseJSON).map((resObj) => resObj["DEPT_CODE"]);
        CacheManager.get().cache("departments", departments);
        return departments;
    }

    /**
     * Gets the course numbers, the instructors and the
     */
    static async fetchClassSummaryFor(department) {
        // no fetch if in cache
        let isCached = await CacheManager.get().isCached(CLASS_SUMMARY_CACHE_STR.formatUnicorn(department));
        if (isCached) {
            console.log(`Hit caching level for department ${department}`);
            return await CacheManager.get().getFromCache(CLASS_SUMMARY_CACHE_STR.formatUnicorn(department));
        }

        let response = await fetch(`${BACKEND_URL}/api_classes?department=${department}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'get'
        });
        let responseJSON = await response.json();
        let classSummaryData = responseJSON["CLASS_SUMMARY"];
        // putting the response inside unsorted list
        let unsorted = new Set();
        let classTypesPerClass = {};
        let instructorsPerClass = {};

        // classArrKey is the course num
        for (let classArrKey of Object.keys(classSummaryData)) {
            // classArr holds an array of all the subsections of each class
            // for each class subsection, meaning for cse 11 lecture then lab...
            let classArr = classSummaryData[classArrKey];
            instructorsPerClass[classArrKey] = new Set();
            classTypesPerClass[classArrKey] = new Set();
            unsorted.add(classArrKey);

            for (let Class of classArr) {
                let instructors = [...Class["INSTRUCTOR"].split("\n")];
                // filter them first before adding
                // just in case we have multiple instructors on one line
                instructors = instructors
                    .filter((instructor) => instructor.length > 0)
                    .map((instructor) => instructor.trim());
                // adding to set
                instructorsPerClass[classArrKey].add(...instructors);

                let classType = Class["TYPE"];
                // adding to set
                classTypesPerClass[classArrKey].add(classType);
            }

            // converting back into set
            instructorsPerClass[classArrKey] = [...instructorsPerClass[classArrKey]];
            classTypesPerClass[classArrKey] = [...classTypesPerClass[classArrKey]]
                .sort((a, b) => codeKeyToVal[a] - codeKeyToVal[b])
                .map((classTypeStr) => {
                    return {label: codeToClassType[classTypeStr], value: codeToClassType[classTypeStr]};
                });
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
            courseNums: sortedCourseNums,
            classTypesPerClass: classTypesPerClass,
            instructorsPerClass: instructorsPerClass,
        };
        // caching here
        CacheManager.get().cache(CLASS_SUMMARY_CACHE_STR.formatUnicorn(department), ret);

        return ret;
    }
}

