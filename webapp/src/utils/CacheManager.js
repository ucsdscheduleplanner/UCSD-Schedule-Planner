import * as localforage from "localforage";

export class CacheManager {
    static async isCached(key) {
       let retObj = await localforage.getItem(key);
       return retObj !== null;
    }

    static async get(key) {
        return await localforage.getItem(key);
    }

    static cache(key, value) {
        localforage.setItem(key, value)
            .then(success => console.log(`Value ${value} cached under key ${key} succesfully`))
            .catch(error => console.error(`Value ${value} failed to cache under key ${key}`));
    }

    static clear(key) {
        localforage.clear(key);
    }
}