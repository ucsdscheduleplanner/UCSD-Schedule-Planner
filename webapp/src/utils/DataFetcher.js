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

export class DataFetcher {
    static async fetchClassData(selectedClasses) {
        let classesToFetch = [];
        let cachedClasses = [];

        for (let Class of selectedClasses) {
            let isCached = await CacheManager.isCached(Class.classTitle);
            if (isCached) {
                cachedClasses.push(Class.classTitle);
            } else {
                classesToFetch.push(Class);
            }
        }

        let ret = {};

        // precompute caching
        for (let cachedClassKey of cachedClasses) {
            console.info(`Caching layer has been hit for ${cachedClassKey}`);
            ret[cachedClassKey] = JSON.parse(await CacheManager.get(cachedClassKey));
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
                let isCached = await CacheManager.isCached(classTitle);
                if (!isCached) {
                    CacheManager.cache(classTitle, JSON.stringify(responseJSON[classTitle]));
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
        let isCached = await CacheManager.isCached("departments");
        if (isCached) {
            return await CacheManager.get("departments");
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
        console.log(responseJSON.toString());
        let departments = Object.values(responseJSON).map((resObj) => resObj["DEPT_CODE"]);
        CacheManager.cache("departments", departments);
        return departments;
    }
}